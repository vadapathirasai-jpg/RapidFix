const dynamodb = require('../config/dynamodb');
const { serviceSchemas } = require('../validators/schemas');
const { generateId } = require('../utils/helpers');

const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;

    let params = {
      TableName: 'Services',
    };

    if (category) {
      params.IndexName = 'category-index';
      params.KeyConditionExpression = 'category = :category';
      params.ExpressionAttributeValues = { ':category': category };
      const result = await dynamodb.query(params).promise();
      return res.json(result.Items);
    }

    const result = await dynamodb.scan(params).promise();
    res.json(result.Items);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await dynamodb.get({
      TableName: 'Services',
      Key: { serviceId },
    }).promise();

    if (!service.Item) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service.Item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

const createService = async (req, res) => {
  const { error, value } = serviceSchemas.create.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const serviceId = generateId();
    const service = {
      serviceId,
      name: value.name,
      category: value.category,
      description: value.description || '',
      basePrice: value.basePrice,
      icon: value.icon || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: 'Services',
      Item: service,
    }).promise();

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description, basePrice, icon } = req.body;

    const updateParts = [];
    const expressionValues = { ':updatedAt': new Date().toISOString() };

    if (name) {
      updateParts.push('#name = :name');
      expressionValues[':name'] = name;
    }

    if (description) {
      updateParts.push('description = :description');
      expressionValues[':description'] = description;
    }

    if (basePrice) {
      updateParts.push('basePrice = :basePrice');
      expressionValues[':basePrice'] = basePrice;
    }

    if (icon) {
      updateParts.push('icon = :icon');
      expressionValues[':icon'] = icon;
    }

    updateParts.push('updatedAt = :updatedAt');

    const expressionNames = {};
    if (name) expressionNames['#name'] = 'name';

    await dynamodb.update({
      TableName: 'Services',
      Key: { serviceId },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeValues: expressionValues,
      ExpressionAttributeNames: Object.keys(expressionNames).length > 0 ? expressionNames : undefined,
    }).promise();

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    await dynamodb.delete({
      TableName: 'Services',
      Key: { serviceId },
    }).promise();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

const searchServices = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const result = await dynamodb.scan({
      TableName: 'Services',
      FilterExpression: 'contains(#name, :query) OR contains(description, :query)',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: { ':query': query },
    }).promise();

    res.json(result.Items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search services' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices,
};
