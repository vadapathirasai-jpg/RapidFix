const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verification.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/:technicianId/submit', authMiddleware, verificationController.submitVerification);
router.get('/:verificationId', verificationController.getVerificationById);
router.get('/technician/:technicianId', verificationController.getVerificationByTechnicianId);
router.get('/', roleMiddleware(['admin']), verificationController.getAllPendingVerifications);
router.put('/:verificationId/approve', authMiddleware, roleMiddleware(['admin']), verificationController.approveVerification);
router.put('/:verificationId/reject', authMiddleware, roleMiddleware(['admin']), verificationController.rejectVerification);

module.exports = router;
