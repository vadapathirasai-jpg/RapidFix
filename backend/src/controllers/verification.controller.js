const dynamodb = require('../config/dynamodb');
const { generateId } = require('../utils/helpers');

const submitVerification = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { licenseNumber, certifications, yearsOfExperience, references } = req.body;

    if (!licenseNumber || !certifications) {
      return res.status(400).json({ error: 'License number and certifications required' });
    }

    const verificationId = generateId();
    const verification = {
      verificationId,
      technicianId,
      licenseNumber,
      certifications: Array.isArray(certifications) ? certifications : [certifications],
      yearsOfExperience: yearsOfExperience || 0,
      references: references || [],
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.put({
      TableName: 'Verifications',
      Item: verification,
    }).promise();

    // Update technician verification status
    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId },
      UpdateExpression: 'SET verificationStatus = :status',
      ExpressionAttributeValues: { ':status': 'pending' },
    }).promise();

    res.status(201).json({
      message: 'Verification submitted successfully',
      verification,
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    res.status(500).json({ error: 'Failed to submit verification' });
  }
};

const getVerificationById = async (req, res) => {
  try {
    const { verificationId } = req.params;

    const verification = await dynamodb.get({
      TableName: 'Verifications',
      Key: { verificationId },
    }).promise();

    if (!verification.Item) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    res.json(verification.Item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verification' });
  }
};

const getVerificationByTechnicianId = async (req, res) => {
  try {
    const { technicianId } = req.params;

    const verification = await dynamodb.query({
      TableName: 'Verifications',
      IndexName: 'technicianId-index',
      KeyConditionExpression: 'technicianId = :techId',
      ExpressionAttributeValues: { ':techId': technicianId },
    }).promise();

    if (verification.Items.length === 0) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    res.json(verification.Items[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verification' });
  }
};

const getAllPendingVerifications = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await dynamodb.query({
      TableName: 'Verifications',
      IndexName: 'status-index',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': 'pending' },
    }).promise();

    const verifications = result.Items
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      verifications,
      total: result.Items.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
};

const approveVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;

    // Get verification
    const verification = await dynamodb.get({
      TableName: 'Verifications',
      Key: { verificationId },
    }).promise();

    if (!verification.Item) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    // Update verification
    await dynamodb.update({
      TableName: 'Verifications',
      Key: { verificationId },
      UpdateExpression: 'SET #status = :status, approvedAt = :approvedAt, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'approved',
        ':approvedAt': new Date().toISOString(),
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    // Update technician
    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId: verification.Item.technicianId },
      UpdateExpression: 'SET verificationStatus = :status',
      ExpressionAttributeValues: { ':status': 'approved' },
    }).promise();

    res.json({ message: 'Verification approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve verification' });
  }
};

const rejectVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason required' });
    }

    // Get verification
    const verification = await dynamodb.get({
      TableName: 'Verifications',
      Key: { verificationId },
    }).promise();

    if (!verification.Item) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    // Update verification
    await dynamodb.update({
      TableName: 'Verifications',
      Key: { verificationId },
      UpdateExpression: 'SET #status = :status, rejectionReason = :reason, rejectedAt = :rejectedAt, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': 'rejected',
        ':reason': reason,
        ':rejectedAt': new Date().toISOString(),
        ':updatedAt': new Date().toISOString(),
      },
    }).promise();

    // Update technician
    await dynamodb.update({
      TableName: 'Technicians',
      Key: { technicianId: verification.Item.technicianId },
      UpdateExpression: 'SET verificationStatus = :status',
      ExpressionAttributeValues: { ':status': 'rejected' },
    }).promise();

    res.json({ message: 'Verification rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject verification' });
  }
};

module.exports = {
  submitVerification,
  getVerificationById,
  getVerificationByTechnicianId,
  getAllPendingVerifications,
  approveVerification,
  rejectVerification,
};
