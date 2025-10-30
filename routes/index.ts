import { Router } from 'express'
import usersRouter from './user'
import experiencesRouter from './experiences'
import bookingsRouter from './bookings'
import slotsRouter from './slots'

const router = Router()

router.use('/api/users', usersRouter)
router.use('/api/experiences', experiencesRouter)
router.use('/api/bookings', bookingsRouter)
router.use('/api/slots', slotsRouter)

export default router
