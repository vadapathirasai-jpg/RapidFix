const dynamodb = require('../config/dynamodb');
const { technicianSchemas } = require('../validators/schemas');
const { generateId, calculateAverageRating } = require('../utils/helpers');

const getAllTechnicians = async (req, res) => {
  try {
    const { specialization, location, rating } = req.query;

    let query = {
      TableName: 'Technicians',
    };

    if (specialization) {
      query.IndexName = 'specialization-index';
      query.KeyConditionExpression = 'specialization = :spec';
      query.ExpressionAttributeValues = { ':spec': specialization };
    } else {
      const scan = await dynamodb.scan(query).promise();
      const technicians = scan.Items;

      if (rating) {
        const techniciansWithRating = await Promise.all(
          technicians.map(async (tech) => {
            const reviews = await dynamodb.query({
              TableName: 'Reviews',
              IndexName: 'technicianId-index',
              KeyConditionExpression: 'technicianId = :techId',
              ExpressionAttributeValues: { ':techId': tech.technicianId },
            }).promise();

            const avgRating = calculateAverageRating(reviews.Items);
            return { ...tech, averageRating: parseFloat(avgRating) };
          })
        );

        return res.json(
          techniciansWithRating.filter(t => t.averageRating >= parseFloat(rating))
        );
      }

      return res.json(technicians);
    }

    const result = await dynamodb.query(query).promise();
    res.json(result.Items);
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};

const getTechnicianById = async (req, res) => {
  try {
    const { technicianId } = req.params;

    const technician = await dynamodb.get({
      TableName: 'Technicians',
      Key: { technicianId },
    }).promise();

    if (!technician.Item) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    // Fetch reviews
    const reviews = await dynamodb.query({
      TableName: 'Reviews',
      IndexName: 'technicianId-index',
      KeyConditionExpression: 'technicianId = :techId',
      ExpressionAttributeValues: { ':techId': technicianId },
    }).promise();

    const averageRating = calculateAverageRating(reviews.Items);

    res.json({
      ...technician.Item,
      averageRating: parseFloat(averageRating),
      reviewCount: reviews.Items.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch technician' });
  }
};

const createTechnicianProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const technicianId = generateId();

    const technician = {
      technicianId,
      userId,
      name: req.body.name || '',
      phone: req.body.phone || '',
      specialization: req.body.specialization || '',
      bio: req.body.bio || '',
      yearsOfExperience: req.body.yearsOfExperience || 0,
      hourlyRate: req.body.hourlyRate || 0,
      serviceRadius: req.body.serviceRadius || 10,
      verificationStatus: 'pending',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: 'Technicians',
      Item: technician,
    }).promise();

    res.status(201).json({
      message: 'Technician profile created',
      technician,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create technician profile' });
  }
};

const updateTechnicianProfile = async (req, res) => {
  const { error, value } = technicianSchemas.update.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { technicianId } = req.params;

    const updateParts = [];
    const expressionValues = { ':updatedAt': new Date().toISOString() };
    const expressionNames = {};

    Object.keys(value).forEach((key) => {
      if (value[key] !== undefined) {
        updateParts.push(`${key} = :${key}`);
        expressionValues[`:${key}`] = value[key];
      }
    });

    updateParts.push('updatedAt = :updatedAt');

    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeValues: expressionValues,
    }).promise();

    res.json({ message: 'Technician profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update technician profile' });
  }
};

const getTechnicianStats = async (req, res) => {
  try {
    const { technicianId } = req.params;

    // Get completed bookings
    const bookings = await dynamodb.query({
      TableName: 'Bookings',
      IndexName: 'technicianId-index',
      KeyConditionExpression: 'technicianId = :techId',
      ExpressionAttributeValues: { ':techId': technicianId },
    }).promise();

    const completedBookings = bookings.Items.filter(b => b.status === 'completed');
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.quotedPrice || 0), 0);

    // Get reviews
    const reviews = await dynamodb.query({
      TableName: 'Reviews',
      IndexName: 'technicianId-index',
      KeyConditionExpression: 'technicianId = :techId',
      ExpressionAttributeValues: { ':techId': technicianId },
    }).promise();

    const averageRating = calculateAverageRating(reviews.Items);

    res.json({
      totalBookings: bookings.Items.length,
      completedBookings: completedBookings.length,
      totalEarnings,
      averageRating: parseFloat(averageRating),
      reviewCount: reviews.Items.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch technician stats' });
  }
};

const setAvailability = async (req, res) => {
  const { error, value } = technicianSchemas.setAvailability.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { technicianId } = req.params;

    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId },
      UpdateExpression: 'SET isAvailable = :available, availableFrom = :from, availableUntil = :until, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':available': value.available,
        ':from': value.availableFrom || null,
        ':until': value.availableUntil || null,
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

module.exports = {
  getAllTechnicians,
  getTechnicianById,
  createTechnicianProfile,
  updateTechnicianProfile,
  getTechnicianStats,
  setAvailability,
};
