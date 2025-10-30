import { Router } from 'express'
const { User } = require('../db/index.js')

const router = Router()

// GET /api/users - list users
router.get('/', async (_req, res) => {
	try {
		const users = await User.find({}).sort({ createdAt: -1 })
		res.json(users)
	} catch (err) {
		console.error('GET /users error:', err)
		res.status(500).json({ error: 'Failed to fetch users' })
	}
})

// POST /api/users - register user
router.post('/', async (req, res) => {
	try {
		const { fullName, email, promoCode } = req.body
		if (!fullName || !email) {
			return res.status(400).json({ error: 'Full name and email are required' })
		}

		const exists = await User.findOne({ email })
		if (exists) {
			return res.status(200).json({ 
				id: exists._id, 
				fullName: exists.fullName, 
				email: exists.email,
				message: 'User already exists'
			})
		}

		const user = await User.create({ fullName, email, promoCode: promoCode || null })
		res.status(201).json({ id: user._id, fullName: user.fullName, email: user.email })
	} catch (err) {
		console.error('POST /users error:', err)
		res.status(500).json({ error: 'Failed to create user' })
	}
})

export default router
