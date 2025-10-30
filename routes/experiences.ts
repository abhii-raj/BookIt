import { Router } from 'express'
const { Experience } = require('../db/index.js')

const router = Router()

// GET /api/experiences - list all experiences
router.get('/', async (_req, res) => {
	try {
		const items = await Experience.find({}).sort({ createdAt: -1 })
		res.json(items)
	} catch (err) {
		console.error('GET /experiences error:', err)
		res.status(500).json({ error: 'Failed to fetch experiences' })
	}
})

// POST /api/experiences - create experience
router.post('/', async (req, res) => {
	try {
		const created = await Experience.create(req.body)
		res.status(201).json(created)
	} catch (err) {
		console.error('POST /experiences error:', err)
		res.status(500).json({ error: 'Failed to create experience' })
	}
})

export default router