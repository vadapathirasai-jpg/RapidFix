const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/:userId', authMiddleware, userController.getUserById);
router.put('/:userId/profile', authMiddleware, userController.updateUserProfile);
router.put('/:userId/password', authMiddleware, userController.changePassword);
router.get('/:userId/bookings', authMiddleware, userController.getUserBookings);
router.delete('/:userId', authMiddleware, userController.deleteUser);

module.exports = router;
