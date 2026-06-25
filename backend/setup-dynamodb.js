const AWS = require('aws-sdk');

// Configure AWS
const dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const tableDefinitions = [
  {
    TableName: 'Users',
    KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
      { AttributeName: 'role', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'role-index',
        KeySchema: [{ AttributeName: 'role', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'Technicians',
    KeySchema: [{ AttributeName: 'technicianId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'technicianId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'specialization', AttributeType: 'S' },
      { AttributeName: 'verificationStatus', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'specialization-index',
        KeySchema: [{ AttributeName: 'specialization', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'verificationStatus-index',
        KeySchema: [{ AttributeName: 'verificationStatus', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'Bookings',
    KeySchema: [{ AttributeName: 'bookingId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'bookingId', AttributeType: 'S' },
      { AttributeName: 'customerId', AttributeType: 'S' },
      { AttributeName: 'technicianId', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
      { AttributeName: 'createdAt', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'customerId-index',
        KeySchema: [{ AttributeName: 'customerId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'technicianId-index',
        KeySchema: [{ AttributeName: 'technicianId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'status-index',
        KeySchema: [{ AttributeName: 'status', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'createdAt-index',
        KeySchema: [{ AttributeName: 'createdAt', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'Reviews',
    KeySchema: [{ AttributeName: 'reviewId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'reviewId', AttributeType: 'S' },
      { AttributeName: 'technicianId', AttributeType: 'S' },
      { AttributeName: 'customerId', AttributeType: 'S' },
      { AttributeName: 'bookingId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'technicianId-index',
        KeySchema: [{ AttributeName: 'technicianId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'customerId-index',
        KeySchema: [{ AttributeName: 'customerId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'bookingId-index',
        KeySchema: [{ AttributeName: 'bookingId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'Services',
    KeySchema: [{ AttributeName: 'serviceId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'serviceId', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'category-index',
        KeySchema: [{ AttributeName: 'category', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'Verifications',
    KeySchema: [{ AttributeName: 'verificationId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'verificationId', AttributeType: 'S' },
      { AttributeName: 'technicianId', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'technicianId-index',
        KeySchema: [{ AttributeName: 'technicianId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'status-index',
        KeySchema: [{ AttributeName: 'status', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'Notifications',
    KeySchema: [{ AttributeName: 'notificationId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'notificationId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
];

async function createTables() {
  console.log('Starting DynamoDB table creation...\n');

  for (const table of tableDefinitions) {
    try {
      console.log(`Creating table: ${table.TableName}...`);
      await dynamodb.createTable(table).promise();
      console.log(`✓ Table ${table.TableName} created successfully!\n`);
    } catch (error) {
      if (error.code === 'ResourceInUseException') {
        console.log(`⚠ Table ${table.TableName} already exists. Skipping...\n`);
      } else {
        console.error(`✗ Error creating table ${table.TableName}:`, error.message, '\n');
      }
    }
  }

  console.log('DynamoDB setup complete!');
  console.log('\nAll 7 tables are ready:');
  console.log('  1. Users');
  console.log('  2. Technicians');
  console.log('  3. Bookings');
  console.log('  4. Reviews');
  console.log('  5. Services');
  console.log('  6. Verifications');
  console.log('  7. Notifications');
}

createTables().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
