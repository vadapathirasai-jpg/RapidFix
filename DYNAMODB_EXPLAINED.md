# How DynamoDB Tables Were Created

## The Problem You Asked About

You asked: **"How did you create DynamoDB tables? In AWS?"**

Good question! The `schema.js` file I created **defines** the table structure, but doesn't actually **create** the tables. Here's what happens:

---

## What I Did vs What You Need to Do

### What I Provided ✓
I created:
1. `schema.js` - Defines the 7 tables (structure only)
2. `setup-dynamodb.js` - Script to automatically create all tables
3. `DYNAMODB_SETUP.md` - Complete setup guide

### What You Need to Do ⚙️
You need to:
1. Get AWS credentials
2. Run the setup script
3. Tables get created in your AWS account

---

## How It Works

```
┌──────────────────────────────────────────────────────────┐
│  Your Local Machine (backend folder)                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  setup-dynamodb.js (the script)                          │
│         ↓                                                 │
│  Reads table definitions from schema.js                  │
│         ↓                                                 │
│  Connects to AWS using credentials in .env               │
│         ↓                                                 │
│  Sends CREATE TABLE requests to AWS                      │
│         ↓                                                 │
└──────────────────────────────────────────────────────────┘
         │
         │ HTTP Request
         ↓
┌──────────────────────────────────────────────────────────┐
│  AWS Data Center                                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  DynamoDB Service receives request                       │
│         ↓                                                 │
│  Creates the 7 tables in your account                    │
│         ↓                                                 │
│  Returns success response                                │
│         ↓                                                 │
└──────────────────────────────────────────────────────────┘
         ↑
         │ Response
         │
┌──────────────────────────────────────────────────────────┐
│  Your Local Machine                                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Script shows: ✓ Table Users created successfully!       │
│               ✓ Table Technicians created successfully!  │
│               etc...                                      │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## The 3 Methods Explained

### Method 1: Automated Script (What I Recommend)

```bash
cd backend
node setup-dynamodb.js
```

**What happens:**
1. Script connects to AWS using credentials from `.env`
2. Reads all 7 table definitions
3. Sends CREATE TABLE requests
4. All tables created in ~2-3 minutes
5. Shows "✓ Table created successfully" for each

**Advantages:**
- One command creates everything
- No manual setup needed
- Can't make mistakes with configuration
- Fastest method

---

### Method 2: AWS Console (Visual/Manual)

You manually create each table in the AWS web dashboard.

**Steps:**
1. Log in to AWS console
2. Go to DynamoDB service
3. Click "Create Table"
4. Fill in table name, partition key, etc.
5. Add Global Secondary Indexes (GSI)
6. Repeat for all 7 tables

**Advantages:**
- Can see tables visually as they're created
- Good for learning how DynamoDB works
- Can verify settings before creating

**Disadvantages:**
- Takes 20-30 minutes for all 7 tables
- Easy to make mistakes
- Can't be automated

---

### Method 3: AWS CLI Commands

```bash
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

**Advantages:**
- Scriptable
- Works in CI/CD pipelines
- Can be saved as shell script

**Disadvantages:**
- Long complex commands
- Hard to debug if something fails
- Not beginner-friendly

---

## Why You Need AWS Credentials

To create DynamoDB tables, AWS needs to know:
1. Who you are (AWS Access Key ID)
2. That it's really you (AWS Secret Access Key)
3. Where to create them (AWS Region)

This is done via:
```bash
aws configure
```

Then the credentials go in `.env`:
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=abcd1234...
AWS_REGION=us-east-1
```

---

## What Gets Created in AWS

When you run the setup script, these 7 tables appear in AWS:

```
AWS DynamoDB Tables (Region: us-east-1)
├── Users
│   ├── PK: userId
│   ├── GSI: email-index
│   └── GSI: role-index
├── Technicians
│   ├── PK: technicianId
│   ├── GSI: userId-index
│   ├── GSI: specialization-index
│   └── GSI: verificationStatus-index
├── Bookings
│   ├── PK: bookingId
│   ├── GSI: customerId-index
│   ├── GSI: technicianId-index
│   ├── GSI: status-index
│   └── GSI: createdAt-index
├── Reviews
│   ├── PK: reviewId
│   ├── GSI: technicianId-index
│   ├── GSI: customerId-index
│   └── GSI: bookingId-index
├── Services
│   ├── PK: serviceId
│   └── GSI: category-index
├── Verifications
│   ├── PK: verificationId
│   ├── GSI: technicianId-index
│   └── GSI: status-index
└── Notifications
    ├── PK: notificationId
    └── GSI: userId-index
```

---

## After Tables Are Created

Your backend code can then:

```javascript
// Create a new user
const user = {
  userId: 'user-123',
  email: 'john@example.com',
  name: 'John Doe',
  role: 'customer',
  createdAt: new Date().toISOString()
};

await dynamodb.put({
  TableName: 'Users',
  Item: user
}).promise();

// Find user by email
const result = await dynamodb.query({
  TableName: 'Users',
  IndexName: 'email-index',
  KeyConditionExpression: 'email = :email',
  ExpressionAttributeValues: {
    ':email': 'john@example.com'
  }
}).promise();
```

---

## Quick Start Timeline

```
Day 1:
  └─ Get AWS credentials (5 min)
  └─ Run setup script (5 min)
  └─ Tables created ✓

Day 2:
  └─ Backend connects to real DynamoDB ✓
  └─ Test API endpoints ✓

Day 3:
  └─ Frontend connects to backend ✓
  └─ Full system working ✓
```

---

## Cost

DynamoDB Pay-Per-Request pricing:

| Operation | Cost |
|-----------|------|
| 1 million reads | $0.25 |
| 1 million writes | $1.25 |
| Storage per GB/month | $0.25 |

**Estimated monthly cost for small app:**
- ~1 million reads/writes per month = ~$1.50
- ~5 GB storage = ~$1.25
- **Total: ~$2.75/month**

Very affordable!

---

## Summary

### I Created: 
✓ Table schema definitions (schema.js)
✓ Automated setup script (setup-dynamodb.js)
✓ Complete documentation (DYNAMODB_SETUP.md)

### You Need To Do:
1. Get AWS credentials
2. Run: `node setup-dynamodb.js`
3. Wait 2-3 minutes
4. Tables are created in your AWS account
5. Backend now has real database

That's it! The tables exist in AWS and your backend will automatically use them.

