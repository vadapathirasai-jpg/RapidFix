const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { roleMiddleware } = require('../middleware/auth');

router.get('/dashboard/stats', roleMiddleware(['admin']), adminController.getDashboardStats);
router.get('/bookings', roleMiddleware(['admin']), adminController.getAllBookings);
router.get('/customers', roleMiddleware(['admin']), adminController.getAllCustomers);
router.get('/technicians', roleMiddleware(['admin']), adminController.getAllTechnicians);
router.put('/technicians/:technicianId/approve', roleMiddleware(['admin']), adminController.approveTechnician);
router.put('/technicians/:technicianId/reject', roleMiddleware(['admin']), adminController.rejectTechnician);
router.get('/bookings/:bookingId', roleMiddleware(['admin']), adminController.getBookingDetails);

module.exports = router;
