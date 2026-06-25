const dynamodb = require('../config/dynamodb');
const { calculateAverageRating } = require('../utils/helpers');

const getDashboardStats = async (req, res) => {
  try {
    // Get all bookings
    const bookingsResult = await dynamodb.scan({
      TableName: 'Bookings',
    }).promise();

    const bookings = bookingsResult.Items;
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.quotedPrice || 0), 0);

    // Get all users
    const usersResult = await dynamodb.scan({
      TableName: 'Users',
    }).promise();

    const users = usersResult.Items;
    const customers = users.filter(u => u.role === 'customer');
    const technicians = users.filter(u => u.role === 'technician');

    // Get pending verifications
    const verificationsResult = await dynamodb.scan({
      TableName: 'Verifications',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': 'pending' },
    }).promise();

    res.json({
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      totalRevenue,
      totalCustomers: customers.length,
      totalTechnicians: technicians.length,
      pendingVerifications: verificationsResult.Items.length,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let params = {
      TableName: 'Bookings',
    };

    if (status) {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues = { ':status': status };
    }

    const result = await dynamodb.scan(params).promise();
    const bookings = result.Items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      bookings,
      total: result.Items.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await dynamodb.query({
      TableName: 'Users',
      IndexName: 'role-index',
      KeyConditionExpression: '#role = :role',
      ExpressionAttributeNames: { '#role': 'role' },
      ExpressionAttributeValues: { ':role': 'customer' },
    }).promise();

    const customers = result.Items
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(c => {
        const { password, ...userWithoutPassword } = c;
        return userWithoutPassword;
      });

    res.json({
      customers,
      total: result.Items.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

const getAllTechnicians = async (req, res) => {
  try {
    const { verificationStatus, limit = 50, offset = 0 } = req.query;

    let params = {
      TableName: 'Technicians',
    };

    if (verificationStatus) {
      params.IndexName = 'verificationStatus-index';
      params.KeyConditionExpression = 'verificationStatus = :status';
      params.ExpressionAttributeValues = { ':status': verificationStatus };
    }

    const result = await dynamodb.query(params).promise() || await dynamodb.scan(params).promise();

    const techniciansWithReviews = await Promise.all(
      result.Items.map(async (tech) => {
        const reviews = await dynamodb.query({
          TableName: 'Reviews',
          IndexName: 'technicianId-index',
          KeyConditionExpression: 'technicianId = :techId',
          ExpressionAttributeValues: { ':techId': tech.technicianId },
        }).promise();

        const avgRating = calculateAverageRating(reviews.Items);
        return {
          ...tech,
          averageRating: parseFloat(avgRating),
          reviewCount: reviews.Items.length,
        };
      })
    );

    const technicians = techniciansWithReviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      technicians,
      total: techniciansWithReviews.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};

const approveTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;

    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId },
      UpdateExpression: 'SET verificationStatus = :status, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':status': 'approved',
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Technician approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve technician' });
  }
};

const rejectTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { reason } = req.body;

    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId },
      UpdateExpression: 'SET verificationStatus = :status, rejectionReason = :reason, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':status': 'rejected',
        ':reason': reason || 'No reason provided',
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Technician rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject technician' });
  }
};

const getBookingDetails = async (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  getAllCustomers,
  getAllTechnicians,
  approveTechnician,
  rejectTechnician,
  getBookingDetails,
};
