import { Router } from 'express'
import { ALLOWED_TIME_SLOTS, DEFAULT_SLOT_CAPACITY } from './_constants'
const { Booking, TimeSlot } = require('../db/index.js')

const router = Router()

// GET /api/bookings - list bookings
router.get('/', async (_req, res) => {
	try {
		const items = await Booking.find({})
			.populate('userId', 'fullName email')
			.populate('experienceId', 'title location price')
			.sort({ createdAt: -1 })
		res.json(items)
	} catch (err) {
		console.error('GET /bookings error:', err)
		res.status(500).json({ error: 'Failed to fetch bookings' })
	}
})

// POST /api/bookings - create booking
router.post('/', async (req, res) => {
  try {
    const { userId, experienceId, bookingDate, timeSlot, numberOfPeople, totalPrice } = req.body
    if (!userId || !experienceId || !bookingDate || !timeSlot || !numberOfPeople || !totalPrice) {
      return res.status(400).json({ error: 'All booking fields are required' })
    }

    // Validate requested time slot is in allowed list
    const allowedTimes = ALLOWED_TIME_SLOTS.map((s) => s.time)
    if (!allowedTimes.includes(timeSlot)) {
      return res.status(400).json({ error: 'Invalid time slot' })
    }
    
    // Extract date string from bookingDate
    const dateStr = new Date(bookingDate).toISOString().split('T')[0]
    
    // Check if user already has a booking for this exact experience at this time slot
    const existingBooking = await Booking.findOne({
      userId,
      experienceId,
      bookingDate: { $gte: new Date(dateStr), $lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000) },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    })
    
    if (existingBooking) {
      return res.status(409).json({ 
        error: 'You have already booked this experience at this time slot. Please choose a different time or experience.'
      })
    }
    
    // Check availability and update slot atomically
    // Ensure slot document exists (unique index prevents duplicates)
    try {
      await TimeSlot.create({
        experienceId,
        date: dateStr,
        timeSlot,
        maxCapacity: DEFAULT_SLOT_CAPACITY,
        bookedCount: 0
      })
    } catch (e: any) {
      // Ignore duplicate key error (slot already exists)
      if (e?.code !== 11000) {
        console.error('Error creating timeslot:', e)
      }
    }

    // Atomically increment if capacity available (no upsert allowed with $expr)
    const slot = await TimeSlot.findOneAndUpdate(
      {
        experienceId,
        date: dateStr,
        timeSlot,
        $expr: {
          $lte: [
            { $add: ['$bookedCount', numberOfPeople] },
            '$maxCapacity'
          ]
        }
      },
      { $inc: { bookedCount: numberOfPeople } },
      { new: true, upsert: false }
    )

    // If slot is null, the $expr condition failed (not enough capacity)
    if (!slot) {
      const existing = await TimeSlot.findOne({ experienceId, date: dateStr, timeSlot })
      const maxCap = existing?.maxCapacity ?? DEFAULT_SLOT_CAPACITY
      const booked = existing?.bookedCount ?? 0
      return res.status(409).json({
        error: 'Not enough slots available',
        available: Math.max(0, maxCap - booked),
        requested: numberOfPeople
      })
    }

    // Create booking
    const created = await Booking.create({
      userId,
      experienceId,
      bookingDate,
      timeSlot,
      numberOfPeople,
      totalPrice,
      status: 'confirmed'
    })
    
    res.status(201).json({ 
      booking: created,
      message: 'Booking confirmed successfully'
    })
  } catch (err) {
    console.error('POST /bookings error:', err)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

export default router


