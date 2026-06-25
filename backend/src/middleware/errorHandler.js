const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.isJoi) {
    return res.status(400).json({
      error: error.details.map(d => d.message).join(', ')
    });
  }

  if (error.code === 'ValidationException') {
    return res.status(400).json({ error: error.message });
  }

  if (error.code === 'ConditionalCheckFailedException') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (error.message === 'User not found' || error.message === 'Booking not found') {
    return res.status(404).json({ error: error.message });
  }

  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
};

module.exports = { errorHandler };
