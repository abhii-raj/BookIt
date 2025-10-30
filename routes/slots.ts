import { Router } from 'express'
import { ALLOWED_TIME_SLOTS, DEFAULT_SLOT_CAPACITY } from './_constants'
const { TimeSlot, Experience } = require('../db/index.js')

const router = Router()

// GET /api/slots/:experienceId/:date - Get availability for a specific date
router.get('/:experienceId/:date', async (req, res) => {
  try {
    const { experienceId, date } = req.params
    
    // Verify experience exists
    const experience = await Experience.findById(experienceId)
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' })
    }

    // Allowed time slots for the product/day
    const timeSlots = ALLOWED_TIME_SLOTS

    // Get existing bookings for this date
    const bookedSlots: Array<{ timeSlot: string; bookedCount: number; maxCapacity: number }> = await TimeSlot.find({
      experienceId,
      date
    })

    // Build availability response
    const availability = timeSlots.map(slot => {
  const booked = bookedSlots.find((b) => b.timeSlot === slot.time)
  const bookedCount = booked ? booked.bookedCount : 0
  const cap = booked ? booked.maxCapacity : (slot.capacity || DEFAULT_SLOT_CAPACITY)
  const slotsLeft = cap - bookedCount
      
      return {
        time: slot.time,
        label: slot.label,
        maxCapacity: cap,
        bookedCount,
        slotsLeft,
        available: slotsLeft > 0
      }
    })

    res.json(availability)
  } catch (err) {
    console.error('GET /slots error:', err)
    res.status(500).json({ error: 'Failed to fetch slot availability' })
  }
})

// POST /api/slots/check - Check if booking is possible
router.post('/check', async (req, res) => {
  try {
    const { experienceId, date, timeSlot, numberOfPeople } = req.body

    if (!experienceId || !date || !timeSlot || !numberOfPeople) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Find or create time slot record
    let slot = await TimeSlot.findOne({ experienceId, date, timeSlot })
    
    if (!slot) {
      slot = { bookedCount: 0, maxCapacity: 10 }
    }

    const available = (slot.maxCapacity - slot.bookedCount) >= numberOfPeople

    res.json({
      available,
      slotsLeft: slot.maxCapacity - slot.bookedCount,
      requested: numberOfPeople
    })
  } catch (err) {
    console.error('POST /slots/check error:', err)
    res.status(500).json({ error: 'Failed to check availability' })
  }
})

export default router
