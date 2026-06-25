# RapidFix Backend API

Complete Express.js + DynamoDB backend for RapidFix booking and technician platform.

## Quick Start

### Prerequisites
- Node.js 16+
- AWS Account with DynamoDB access
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Update `.env` with your AWS credentials and JWT secret:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
JWT_SECRET=your_super_secret_key
```

### Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Run Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:bookingId` - Get booking details
- `GET /api/bookings/customer/:customerId` - Get customer bookings
- `GET /api/bookings/technician/:technicianId` - Get technician bookings
- `PUT /api/bookings/:bookingId/accept` - Accept booking
- `PUT /api/bookings/:bookingId/status` - Update booking status
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking
- `PUT /api/bookings/:bookingId/complete` - Complete booking

### Technicians
- `GET /api/technicians` - Get all technicians
- `GET /api/technicians/:technicianId` - Get technician details
- `POST /api/technicians/:userId/profile` - Create technician profile
- `PUT /api/technicians/:technicianId` - Update technician profile
- `GET /api/technicians/:technicianId/stats` - Get technician stats
- `PUT /api/technicians/:technicianId/availability` - Set availability

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId/profile` - Update profile
- `PUT /api/users/:userId/password` - Change password
- `GET /api/users/:userId/bookings` - Get user bookings
- `DELETE /api/users/:userId` - Delete user

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/bookings` - All bookings with filters
- `GET /api/admin/customers` - All customers
- `GET /api/admin/technicians` - All technicians
- `PUT /api/admin/technicians/:technicianId/approve` - Approve technician
- `PUT /api/admin/technicians/:technicianId/reject` - Reject technician
- `GET /api/admin/bookings/:bookingId` - Booking details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:reviewId` - Get review
- `GET /api/reviews/technician/:technicianId` - Get technician reviews
- `GET /api/reviews/customer/:customerId` - Get customer reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:serviceId` - Get service details
- `GET /api/services/search/query` - Search services
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:serviceId` - Update service (admin only)
- `DELETE /api/services/:serviceId` - Delete service (admin only)

### Verification
- `POST /api/verification/:technicianId/submit` - Submit verification
- `GET /api/verification/:verificationId` - Get verification
- `GET /api/verification/technician/:technicianId` - Get technician verification
- `GET /api/verification` - Get pending verifications (admin only)
- `PUT /api/verification/:verificationId/approve` - Approve (admin only)
- `PUT /api/verification/:verificationId/reject` - Reject (admin only)

## Database Schema

### Users Table
- userId (PK): UUID
- email: String (GSI)
- password: Hashed password
- name: String
- role: customer | technician | admin (GSI)
- phone: String
- address: String
- city: String
- state: String
- pincode: String
- createdAt: ISO timestamp
- updatedAt: ISO timestamp

### Technicians Table
- technicianId (PK): UUID
- userId (GSI): User reference
- specialization (GSI): Service type
- bio: String
- yearsOfExperience: Number
- hourlyRate: Number
- serviceRadius: Number
- verificationStatus (GSI): pending | approved | rejected
- isAvailable: Boolean
- createdAt: ISO timestamp
- updatedAt: ISO timestamp

### Bookings Table
- bookingId (PK): UUID
- customerId (GSI): Customer reference
- technicianId (GSI): Technician reference
- serviceId: Service reference
- status (GSI): pending | accepted | in-progress | completed | cancelled
- paymentStatus: unpaid | paid | refunded
- location: String
- scheduledDate: ISO timestamp
- budget: Number
- quotedPrice: Number
- description: String
- technicianNotes: String
- createdAt (GSI): ISO timestamp
- updatedAt: ISO timestamp

### Reviews Table
- reviewId (PK): UUID
- technicianId (GSI): Technician reference
- customerId (GSI): Customer reference
- bookingId (GSI): Booking reference
- rating: 1-5
- comment: String
- createdAt: ISO timestamp
- updatedAt: ISO timestamp

### Services Table
- serviceId (PK): UUID
- name: String
- category (GSI): String
- description: String
- basePrice: Number
- icon: String (icon name)
- createdAt: ISO timestamp
- updatedAt: ISO timestamp

### Verifications Table
- verificationId (PK): UUID
- technicianId (GSI): Technician reference
- licenseNumber: String
- certifications: Array
- yearsOfExperience: Number
- references: Array
- status (GSI): pending | approved | rejected
- submittedAt: ISO timestamp
- approvedAt: ISO timestamp (optional)
- rejectedAt: ISO timestamp (optional)
- rejectionReason: String (optional)
- updatedAt: ISO timestamp

### Notifications Table
- notificationId (PK): UUID
- userId (GSI): User reference
- type: String
- title: String
- message: String
- read: Boolean
- createdAt: ISO timestamp

## Authentication

Uses JWT (JSON Web Tokens) for stateless authentication.

### Token Format
```
Bearer <access_token>
```

### Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Error Handling

All errors follow consistent format:
```json
{
  "error": "Error message"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Development

### Running Tests
```bash
npm test
```

### Project Structure
```
backend/
├── src/
│   ├── config/         # Database and configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # Route definitions
│   ├── utils/          # Helper functions
│   ├── validators/     # Input validation schemas
│   └── server.js       # Main server file
├── tests/              # Test files
├── package.json
└── README.md
```

## Deployment

### AWS Lambda
The backend can be deployed to AWS Lambda for serverless operation. Use the Serverless Framework or AWS SAM.

### Docker
```bash
docker build -t rapidfix-backend .
docker run -p 5000:5000 rapidfix-backend
```

### Vercel
```bash
vercel deploy
```

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] File upload for documents and images
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced search and filtering
- [ ] Caching with Redis
- [ ] API rate limiting
- [ ] Comprehensive logging

## Support

For issues and questions, contact the development team.
