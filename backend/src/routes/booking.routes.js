const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/:bookingId', bookingController.getBookingById);
router.get('/customer/:customerId', bookingController.getCustomerBookings);
router.get('/technician/:technicianId', bookingController.getTechnicianBookings);
router.put('/:bookingId/accept', authMiddleware, bookingController.acceptBooking);
router.put('/:bookingId/status', authMiddleware, bookingController.updateBookingStatus);
router.put('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);
router.put('/:bookingId/complete', authMiddleware, bookingController.completeBooking);

module.exports = router;
