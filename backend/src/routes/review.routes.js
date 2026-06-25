const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/:reviewId', reviewController.getReviewById);
router.get('/technician/:technicianId', reviewController.getReviewsByTechnician);
router.get('/customer/:customerId', reviewController.getReviewsByCustomer);
router.put('/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;
