const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', serviceController.getAllServices);
router.get('/:serviceId', serviceController.getServiceById);
router.get('/search/query', serviceController.searchServices);
router.post('/', authMiddleware, roleMiddleware(['admin']), serviceController.createService);
router.put('/:serviceId', authMiddleware, roleMiddleware(['admin']), serviceController.updateService);
router.delete('/:serviceId', authMiddleware, roleMiddleware(['admin']), serviceController.deleteService);

module.exports = router;
