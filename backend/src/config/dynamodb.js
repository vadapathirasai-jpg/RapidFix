const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// For local development, uncomment the next line and ensure DynamoDB Local is running
// AWS.config.update({ endpoint: process.env.AWS_DYNAMODB_ENDPOINT || 'http://localhost:8000' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamodb;
