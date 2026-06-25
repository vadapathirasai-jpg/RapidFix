const jwt = require('jsonwebtoken');
const dynamodb = require('../config/dynamodb');
const { authSchemas } = require('../validators/schemas');
const {
  generateToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  generateId,
} = require('../utils/helpers');

const register = async (req, res) => {
  const { error, value } = authSchemas.register.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Check if user already exists
    const existing = await dynamodb.query({
      TableName: 'Users',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': value.email },
    }).promise();

    if (existing.Items.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const userId = generateId();
    const hashedPassword = await hashPassword(value.password);

    const user = {
      userId,
      email: value.email,
      password: hashedPassword,
      name: value.name,
      role: value.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: 'Users',
      Item: user,
    }).promise();

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.userId,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { error, value } = authSchemas.login.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Find user by email
    const result = await dynamodb.query({
      TableName: 'Users',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': value.email },
    }).promise();

    if (result.Items.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.Items[0];
    const passwordMatch = await comparePassword(value.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.userId,
    });

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await dynamodb.get({
      TableName: 'Users',
      Key: { userId: decoded.userId },
    }).promise();

    if (!user.Item) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newToken = generateToken({
      userId: user.Item.userId,
      email: user.Item.email,
      role: user.Item.role,
    });

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await dynamodb.get({
      TableName: 'Users',
      Key: { userId: req.user.userId },
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

module.exports = {
  register,
  login,
  refreshToken,
  getCurrentUser,
};
