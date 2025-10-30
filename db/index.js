const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')


dotenv.config({ path: path.resolve(__dirname, '../.env') })



async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(' MongoDB Connected')
  } catch (err) {
    console.error(' MongoDB connection error:', err)
    process.exit(1)
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  promoCode: {
    type: String,
    trim: true,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Experience Schema
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['adventure', 'nature', 'cultural', 'water-sports'],
    default: 'adventure'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true // Format: "07:00 am", "09:00 am", etc.
  },
  numberOfPeople: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// TimeSlot Schema - tracks availability for each experience
const timeSlotSchema = new mongoose.Schema({
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  date: {
    type: String, // Format: "2025-10-22" (YYYY-MM-DD)
    required: true
  },
  timeSlot: {
    type: String,
    required: true // Format: "07:00 am"
  },
  maxCapacity: {
    type: Number,
    default: 10 // Max people per slot
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Compound index to ensure unique slots
timeSlotSchema.index({ experienceId: 1, date: 1, timeSlot: 1 }, { unique: true })

// Models
const User = mongoose.models.User || mongoose.model('User', userSchema)
const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema)
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
const TimeSlot = mongoose.models.TimeSlot || mongoose.model('TimeSlot', timeSlotSchema)

module.exports = { connectDB, User, Experience, Booking, TimeSlot }
