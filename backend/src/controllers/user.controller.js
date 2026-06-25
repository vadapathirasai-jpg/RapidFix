const dynamodb = require('../config/dynamodb');
const { hashPassword } = require('../utils/helpers');

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await dynamodb.get({
      TableName: 'Users',
      Key: { userId },
    }).promise();

    if (!user.Item) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user.Item;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, address, city, state, pincode } = req.body;

    const updateParts = [];
    const expressionValues = { ':updatedAt': new Date().toISOString() };

    if (name) {
      updateParts.push('#name = :name');
      expressionValues[':name'] = name;
    }
    if (phone) {
      updateParts.push('phone = :phone');
      expressionValues[':phone'] = phone;
    }
    if (address) {
      updateParts.push('address = :address');
      expressionValues[':address'] = address;
    }
    if (city) {
      updateParts.push('city = :city');
      expressionValues[':city'] = city;
    }
    if (state) {
      updateParts.push('#state = :state');
      expressionValues[':state'] = state;
    }
    if (pincode) {
      updateParts.push('pincode = :pincode');
      expressionValues[':pincode'] = pincode;
    }

    updateParts.push('updatedAt = :updatedAt');

    const expressionNames = {};
    if (name) expressionNames['#name'] = 'name';
    if (state) expressionNames['#state'] = 'state';

    await dynamodb.update({
      TableName: 'Users',
      Key: { userId },
      UpdateExpression: `SET ${updateParts.join(', ')}`,
      ExpressionAttributeValues: expressionValues,
      ExpressionAttributeNames: Object.keys(expressionNames).length > 0 ? expressionNames : undefined,
    }).promise();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords required' });
    }

    const user = await dynamodb.get({
      TableName: 'Users',
      Key: { userId },
    }).promise();

    if (!user.Item) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { comparePassword } = require('../utils/helpers');
    const passwordMatch = await comparePassword(oldPassword, user.Item.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await dynamodb.update({
      TableName: 'Users',
      Key: { userId },
      UpdateExpression: 'SET password = :password, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':password': hashedNewPassword,
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user first to find their customer bookings
    const user = await dynamodb.get({
      TableName: 'Users',
      Key: { userId },
    }).promise();

    if (!user.Item) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookings = await dynamodb.query({
      TableName: 'Bookings',
      IndexName: 'customerId-index',
      KeyConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: { ':customerId': userId },
    }).promise();

    res.json(bookings.Items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await dynamodb.delete({
      TableName: 'Users',
      Key: { userId },
    }).promise();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getUserById,
  updateUserProfile,
  changePassword,
  getUserBookings,
  deleteUser,
};
