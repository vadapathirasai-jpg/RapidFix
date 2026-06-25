# DynamoDB Setup Guide for RapidFix Backend

## Overview

This guide shows you how to create DynamoDB tables for the RapidFix backend. There are **3 methods** depending on your preference.

---

## Method 1: Automated Setup (Easiest) ⚡

Use the setup script to automatically create all 7 tables.

### Steps:

1. **Install AWS CLI** (if not already installed)
   ```bash
   # Mac
   brew install awscli
   
   # Linux
   sudo apt-get install awscli
   
   # Windows (using choco)
   choco install awscli
   ```

2. **Configure AWS Credentials**
   ```bash
   aws configure
   ```
   You'll be prompted for:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (use: us-east-1)
   - Default output format (use: json)

3. **Update .env file in backend folder**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   NODE_ENV=development
   JWT_SECRET=your-random-secret-key
   PORT=5000
   ```

4. **Install AWS SDK**
   ```bash
   npm install aws-sdk
   ```

5. **Run Setup Script**
   ```bash
   cd backend
   node setup-dynamodb.js
   ```

   Expected output:
   ```
   Starting DynamoDB table creation...

   Creating table: Users...
   ✓ Table Users created successfully!

   Creating table: Technicians...
   ✓ Table Technicians created successfully!

   [... more tables ...]

   DynamoDB setup complete!

   All 7 tables are ready:
     1. Users
     2. Technicians
     3. Bookings
     4. Reviews
     5. Services
     6. Verifications
     7. Notifications
   ```

---

## Method 2: AWS Console (Visual) 🖱️

Create tables manually using AWS Management Console.

### Steps:

1. **Log in to AWS**
   - Go to https://console.aws.amazon.com
   - Search for "DynamoDB"
   - Click on DynamoDB service

2. **Create Users Table**
   - Click "Create table"
   - Table name: `Users`
   - Partition key: `userId` (String)
   - Billing mode: Pay-per-request
   - Click "Create"

3. **Add Global Secondary Indexes (GSI)**
   - Go to "Indexes" tab
   - Click "Create GSI"
   - Index name: `email-index`
   - Partition key: `email`
   - Click "Create"
   - Repeat for `role-index` with partition key `role`

4. **Repeat for Other Tables**
   - Technicians (with userId, specialization, verificationStatus GSI)
   - Bookings (with customerId, technicianId, status, createdAt GSI)
   - Reviews (with technicianId, customerId, bookingId GSI)
   - Services (with category GSI)
   - Verifications (with technicianId, status GSI)
   - Notifications (with userId GSI)

---

## Method 3: AWS CLI Commands 💻

Use AWS CLI to create tables via command line.

### Create Users Table
```bash
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
    AttributeName=role,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=role-index,KeySchema=[{AttributeName=role,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Create Technicians Table
```bash
aws dynamodb create-table \
  --table-name Technicians \
  --attribute-definitions \
    AttributeName=technicianId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=specialization,AttributeType=S \
    AttributeName=verificationStatus,AttributeType=S \
  --key-schema AttributeName=technicianId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=specialization-index,KeySchema=[{AttributeName=specialization,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=verificationStatus-index,KeySchema=[{AttributeName=verificationStatus,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Create Bookings Table
```bash
aws dynamodb create-table \
  --table-name Bookings \
  --attribute-definitions \
    AttributeName=bookingId,AttributeType=S \
    AttributeName=customerId,AttributeType=S \
    AttributeName=technicianId,AttributeType=S \
    AttributeName=status,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=bookingId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=customerId-index,KeySchema=[{AttributeName=customerId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=technicianId-index,KeySchema=[{AttributeName=technicianId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=status-index,KeySchema=[{AttributeName=status,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=createdAt-index,KeySchema=[{AttributeName=createdAt,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Create Reviews Table
```bash
aws dynamodb create-table \
  --table-name Reviews \
  --attribute-definitions \
    AttributeName=reviewId,AttributeType=S \
    AttributeName=technicianId,AttributeType=S \
    AttributeName=customerId,AttributeType=S \
    AttributeName=bookingId,AttributeType=S \
  --key-schema AttributeName=reviewId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=technicianId-index,KeySchema=[{AttributeName=technicianId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=customerId-index,KeySchema=[{AttributeName=customerId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=bookingId-index,KeySchema=[{AttributeName=bookingId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Create Services Table
```bash
aws dynamodb create-table \
  --table-name Services \
  --attribute-definitions \
    AttributeName=serviceId,AttributeType=S \
    AttributeName=category,AttributeType=S \
  --key-schema AttributeName=serviceId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=category-index,KeySchema=[{AttributeName=category,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Create Verifications Table
```bash
aws dynamodb create-table \
  --table-name Verifications \
  --attribute-definitions \
    AttributeName=verificationId,AttributeType=S \
    AttributeName=technicianId,AttributeType=S \
    AttributeName=status,AttributeType=S \
  --key-schema AttributeName=verificationId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=technicianId-index,KeySchema=[{AttributeName=technicianId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=status-index,KeySchema=[{AttributeName=status,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Create Notifications Table
```bash
aws dynamodb create-table \
  --table-name Notifications \
  --attribute-definitions \
    AttributeName=notificationId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=notificationId,KeyType=HASH \
  --global-secondary-indexes \
    "IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

## Verify Tables Created

### Check in AWS Console
1. Go to DynamoDB service
2. Click "Tables" on the left
3. You should see all 7 tables listed

### Check via AWS CLI
```bash
aws dynamodb list-tables --region us-east-1
```

Expected output:
```
{
    "TableNames": [
        "Users",
        "Technicians",
        "Bookings",
        "Reviews",
        "Services",
        "Verifications",
        "Notifications"
    ]
}
```

---

## Table Structure Reference

### Users Table
```
Primary Key: userId (String)
Indexes:
  - email-index (for finding users by email)
  - role-index (for listing users by role)
```

### Technicians Table
```
Primary Key: technicianId (String)
Indexes:
  - userId-index (link technician to user)
  - specialization-index (filter by skill)
  - verificationStatus-index (admin verification queue)
```

### Bookings Table
```
Primary Key: bookingId (String)
Indexes:
  - customerId-index (get user's bookings)
  - technicianId-index (get tech's jobs)
  - status-index (filter by pending/accepted/completed)
  - createdAt-index (time-based queries)
```

### Reviews Table
```
Primary Key: reviewId (String)
Indexes:
  - technicianId-index (get tech's ratings)
  - customerId-index (get customer's reviews)
  - bookingId-index (link review to booking)
```

### Services Table
```
Primary Key: serviceId (String)
Indexes:
  - category-index (browse by service type)
```

### Verifications Table
```
Primary Key: verificationId (String)
Indexes:
  - technicianId-index (tech's verification status)
  - status-index (admin queue: pending/approved/rejected)
```

### Notifications Table
```
Primary Key: notificationId (String)
Indexes:
  - userId-index (get user's notifications)
```

---

## Billing

DynamoDB uses **Pay-Per-Request** pricing:
- $1.25 per 1 million write requests
- $0.25 per 1 million read requests
- Very affordable for small to medium apps

Free tier: 25 GB storage + 25 read/write capacity units

---

## Common Issues

### Issue: "Credentials not found"
**Solution:** Run `aws configure` and enter your credentials

### Issue: "UnrecognizedClientException"
**Solution:** Check your AWS Access Key and Secret Key are correct

### Issue: "ValidationException"
**Solution:** Make sure attribute names and table names match exactly

### Issue: "Throttling"
**Solution:** Use Pay-Per-Request billing (already configured)

---

## Next Steps

1. Create the tables using Method 1 (automated)
2. Update `.env` with your AWS credentials
3. Run `npm run dev` to start the backend
4. Test APIs with the backend running
5. Connect the frontend to the backend

---

## Support

If tables aren't creating:
1. Check AWS credentials are correct
2. Verify you're using the right region (us-east-1)
3. Check if tables already exist (delete them first if needed)
4. Check AWS CloudWatch logs for errors

