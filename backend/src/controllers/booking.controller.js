const dynamodb = require('../config/dynamodb');
const { bookingSchemas } = require('../validators/schemas');
const { generateId } = require('../utils/helpers');

const createBooking = async (req, res) => {
  const { error, value } = bookingSchemas.create.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const bookingId = generateId();
    const booking = {
      bookingId,
      customerId: value.customerId,
      technicianId: value.technicianId || null,
      serviceId: value.serviceId,
      description: value.description || '',
      location: value.location,
      scheduledDate: value.scheduledDate,
      budget: value.budget,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: 'Bookings',
      Item: booking,
    }).promise();

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await dynamodb.get({
      TableName: 'Bookings',
      Key: { bookingId },
    }).promise();

    if (!booking.Item) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking.Item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query;

    let query = {
      TableName: 'Bookings',
      IndexName: 'customerId-index',
      KeyConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: { ':customerId': customerId },
    };

    if (status) {
      query.FilterExpression = '#status = :status';
      query.ExpressionAttributeNames = { '#status': 'status' };
      query.ExpressionAttributeValues[':status'] = status;
    }

    const result = await dynamodb.query(query).promise();
    res.json(result.Items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getTechnicianBookings = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { status } = req.query;

    let query = {
      TableName: 'Bookings',
      IndexName: 'technicianId-index',
      KeyConditionExpression: 'technicianId = :technicianId',
      ExpressionAttributeValues: { ':technicianId': technicianId },
    };

    if (status) {
      query.FilterExpression = '#status = :status';
      query.ExpressionAttributeNames = { '#status': 'status' };
      query.ExpressionAttributeValues[':status'] = status;
    }

    const result = await dynamodb.query(query).promise();
    res.json(result.Items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const acceptBooking = async (req, res) => {
  const { error, value } = bookingSchemas.accept.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { bookingId } = req.params;
    const { quotedPrice } = value;

    const booking = await dynamodb.get({
      TableName: 'Bookings',
      Key: { bookingId },
    }).promise();

    if (!booking.Item) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await dynamodb.update({
      TableName: 'Bookings',
      Key: { bookingId },
      UpdateExpression: 'SET #status = :status, quotedPrice = :quotedPrice, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'accepted',
        ':quotedPrice': quotedPrice,
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Booking accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept booking' });
  }
};

const updateBookingStatus = async (req, res) => {
  const { error, value } = bookingSchemas.update.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { bookingId } = req.params;

    let updateExpression = 'SET #status = :status, updatedAt = :updatedAt';
    const expressionValues = {
      ':status': value.status,
      ':updatedAt': new Date().toISOString(),
    };
    const expressionNames = { '#status': 'status' };

    if (value.technicianNotes) {
      updateExpression += ', technicianNotes = :notes';
      expressionValues[':notes'] = value.technicianNotes;
    }

    await dynamodb.update({
      TableName: 'Bookings',
      Key: { bookingId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
    }).promise();

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await dynamodb.update({
      TableName: 'Bookings',
      Key: { bookingId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'cancelled',
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await dynamodb.update({
      TableName: 'Bookings',
      Key: { bookingId },
      UpdateExpression: 'SET #status = :status, paymentStatus = :paymentStatus, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'completed',
        ':paymentStatus': 'paid',
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Booking completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete booking' });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getCustomerBookings,
  getTechnicianBookings,
  acceptBooking,
  updateBookingStatus,
  cancelBooking,
  completeBooking,
};
