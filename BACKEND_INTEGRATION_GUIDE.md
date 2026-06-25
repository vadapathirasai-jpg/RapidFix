# RapidFix: Backend Integration Guide

This guide explains how to integrate the newly created Express.js + DynamoDB backend with the existing frontend.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           Frontend (Next.js 16)                 │
│  - React Components                             │
│  - Role-based UI                                │
│  - Placeholder Service Calls                    │
└────────────────────┬────────────────────────────┘
                     │ API Calls (HTTP)
┌────────────────────▼────────────────────────────┐
│        Backend (Express.js)                     │
│  - 8 Controller Modules                         │
│  - 7 DynamoDB Tables                            │
│  - JWT Authentication                           │
│  - Role-based Authorization                     │
└─────────────────────────────────────────────────┘
```

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Update `.env`:
```
PORT=5000
NODE_ENV=development
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Step 3: Run Backend Server

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 4: Update Frontend Service Layer

The frontend already has `/lib/services.ts` with placeholder functions. Update it to call the real backend:

```typescript
// lib/services.ts - Example Updates
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Authentication
export async function loginUser(email: string, password: string, role: string) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

export async function registerUser(name: string, email: string, password: string, role: string) {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    name,
    email,
    password,
    role,
  });
  return response.data;
}

// Bookings
export async function createBooking(bookingData: any) {
  const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
}

// ... other service functions
```

### Step 5: Add API Base URL to Frontend .env

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Integration by Feature

### Authentication

**Frontend Flow:**
1. User enters email/password on login page
2. Frontend calls `registerUser()` or `loginUser()`
3. Backend returns JWT token
4. Frontend stores token in auth context
5. Token sent with all subsequent requests

**Backend Endpoints:**
- `POST /auth/register` → Returns token + user data
- `POST /auth/login` → Returns token + user data
- `GET /auth/me` → Returns current user (requires auth)

### Bookings

**Frontend Flow:**
1. Customer fills booking form on `/dispatch`
2. Calls `createBooking()`
3. Backend creates booking in DynamoDB
4. Returns booking ID
5. Redirect to confirmation page

**Backend Endpoints:**
- `POST /bookings` → Create booking
- `GET /bookings/customer/:customerId` → Fetch customer bookings
- `PUT /bookings/:bookingId/accept` → Technician accepts job
- `PUT /bookings/:bookingId/complete` → Mark completed

### Technician Dashboard

**Frontend Flow:**
1. Technician logs in
2. Dashboard loads from `/dashboard`
3. Fetches jobs via `getTechnicianBookings()`
4. Shows pending/active jobs
5. Can accept, view details, complete

**Backend Endpoints:**
- `GET /bookings/technician/:technicianId` → Active jobs
- `PUT /bookings/:bookingId/accept` → Accept job
- `GET /technicians/:technicianId/stats` → Earnings data

### Admin Dashboard

**Frontend Flow:**
1. Admin logs in at `/admin`
2. Dashboard loads stats
3. Can view tables: bookings, customers, technicians
4. Can approve/reject technician verifications

**Backend Endpoints:**
- `GET /admin/dashboard/stats` → Revenue, bookings count, etc.
- `GET /admin/bookings` → All bookings with filters
- `GET /admin/technicians` → All technicians
- `PUT /admin/technicians/:id/approve` → Verify technician

## Updated Service Layer Example

Here's a complete example of updated service functions:

```typescript
// lib/services.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('authToken', token);
}

function getAuthHeader() {
  const token = authToken || localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth Services
export async function registerUser(name: string, email: string, password: string, role: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      email,
      password,
      role,
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Booking Services
export async function createBooking(bookingData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getCustomerBookings(customerId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bookings/customer/${customerId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getTechnicianBookings(technicianId: string, status?: string) {
  try {
    const url = status
      ? `${API_BASE_URL}/bookings/technician/${technicianId}?status=${status}`
      : `${API_BASE_URL}/bookings/technician/${technicianId}`;
    const response = await axios.get(url, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Technician Services
export async function getAllTechnicians(specialization?: string) {
  try {
    const url = specialization
      ? `${API_BASE_URL}/technicians?specialization=${specialization}`
      : `${API_BASE_URL}/technicians`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getTechnicianStats(technicianId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/technicians/${technicianId}/stats`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Admin Services
export async function getAdminDashboardStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getAllBookingsAdmin(status?: string) {
  try {
    const url = status
      ? `${API_BASE_URL}/admin/bookings?status=${status}`
      : `${API_BASE_URL}/admin/bookings`;
    const response = await axios.get(url, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
```

## Testing the Integration

### 1. Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route (with token)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

### 4. Test Booking Creation

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "customerId": "user-id",
    "serviceId": "service-id",
    "location": "123 Main St",
    "scheduledDate": "2024-02-15T10:00:00Z",
    "budget": 500
  }'
```

## Troubleshooting

### CORS Issues
Update `.env` in backend:
```
FRONTEND_URL=http://localhost:3000
```

### Token Expiration
Frontend should implement token refresh:
```typescript
if (error.response?.status === 401) {
  // Call refresh endpoint
  const newToken = await refreshToken();
  // Retry request with new token
}
```

### DynamoDB Connection
Ensure AWS credentials are correct:
```bash
# Verify credentials
aws sts get-caller-identity
```

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up JWT secret rotation
- [ ] Enable DynamoDB backups
- [ ] Configure rate limiting
- [ ] Set up logging and monitoring
- [ ] Enable SSL/TLS
- [ ] Configure API documentation

## Next Steps

1. Replace all mock service calls in frontend
2. Add error handling and loading states
3. Implement real-time notifications with WebSockets
4. Add file upload for documents and images
5. Integrate payment processing
6. Set up automated testing
7. Deploy to production

## Support

For issues, check:
1. Backend logs: `npm run dev` output
2. Frontend console: Browser DevTools
3. Network tab: Check API request/response
4. DynamoDB: Verify table structure and data
