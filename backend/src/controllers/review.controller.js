const dynamodb = require('../config/dynamodb');
const { reviewSchemas } = require('../validators/schemas');
const { generateId, calculateAverageRating } = require('../utils/helpers');

const createReview = async (req, res) => {
  const { error, value } = reviewSchemas.create.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const reviewId = generateId();
    const review = {
      reviewId,
      bookingId: value.bookingId,
      technicianId: value.technicianId,
      customerId: req.user.userId,
      rating: value.rating,
      comment: value.comment || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: 'Reviews',
      Item: review,
    }).promise();

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

const getReviewsByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;

    const reviews = await dynamodb.query({
      TableName: 'Reviews',
      IndexName: 'technicianId-index',
      KeyConditionExpression: 'technicianId = :techId',
      ExpressionAttributeValues: { ':techId': technicianId },
    }).promise();

    const averageRating = calculateAverageRating(reviews.Items);

    res.json({
      reviews: reviews.Items,
      averageRating: parseFloat(averageRating),
      count: reviews.Items.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

const getReviewsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const reviews = await dynamodb.query({
      TableName: 'Reviews',
      IndexName: 'customerId-index',
      KeyConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: { ':customerId': customerId },
    }).promise();

    res.json(reviews.Items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await dynamodb.get({
      TableName: 'Reviews',
      Key: { reviewId },
    }).promise();

    if (!review.Item) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review.Item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating && !comment) {
      return res.status(400).json({ error: 'Rating or comment required' });
    }

    const updateParts = [];
    const expressionValues = { ':updatedAt': new Date().toISOString() };

    if (rating) {
      updateParts.push('rating = :rating');
      expressionValues[':rating'] = rating;
    }

    if (comment) {
      updateParts.push('comment = :comment');
      expressionValues[':comment'] = comment;
    }

    updateParts.push('updatedAt = :updatedAt');

    await dynamodb.update({
      TableName: 'Reviews',
      Key: { reviewId },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeValues: expressionValues,
    }).promise();

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await dynamodb.delete({
      TableName: 'Reviews',
      Key: { reviewId },
    }).promise();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

module.exports = {
  createReview,
  getReviewsByTechnician,
  getReviewsByCustomer,
  getReviewById,
  updateReview,
  deleteReview,
};
