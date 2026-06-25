const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technician.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/', technicianController.getAllTechnicians);
router.get('/:technicianId', technicianController.getTechnicianById);
router.post('/:userId/profile', authMiddleware, technicianController.createTechnicianProfile);
router.put('/:technicianId', authMiddleware, technicianController.updateTechnicianProfile);
router.get('/:technicianId/stats', technicianController.getTechnicianStats);
router.put('/:technicianId/availability', authMiddleware, technicianController.setAvailability);

module.exports = router;
