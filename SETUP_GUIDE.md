# Real Estate Management System - Setup Guide

This guide will help you set up and test the complete real estate management system.

## System Overview

A comprehensive real estate platform with three user roles:
- **Admin**: Full control - manage agents, approve/reject properties, view analytics
- **Agent**: List and manage properties, handle bookings
- **User**: Browse properties, book viewings, manage favorites, receive notifications

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** running on `localhost:27017`
3. **Git** (to clone/pull changes)

## Installation Steps

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

The server already has a `.env` file at `/server/.env` with:
```
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:3000

MONGO_URI=mongodb://127.0.0.1:27017/real_estate_pro

ACCESS_TOKEN_SECRET=your-secret-access-token-key-change-this-in-production
ACCESS_TOKEN_MIN=15

REFRESH_TOKEN_DAYS=7
REFRESH_TOKEN_REMEMBER_DAYS=30
```

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongodb

# Or run directly
mongod
```

### 4. Seed the Database

Populate the database with test data:
```bash
cd server
npm run seed
```

This creates:
- **1 Admin**: `admin@realestate.com` / `Admin123!`
- **5 Agents**: `agent1@realestate.com` to `agent5@realestate.com` / `Agent123!`
- **10 Users**: `user1@example.com` to `user10@example.com` / `User123!`
- **30 Properties** (mix of approved, pending, rejected)
- **20 Bookings** (various statuses)
- **Sample Notifications and Favorites**

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will start on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will start on http://localhost:3000

## Test Accounts

| Role  | Email                      | Password   |
|-------|----------------------------|------------|
| Admin | admin@realestate.com       | Admin123!  |
| Agent | agent1@realestate.com      | Agent123!  |
| Agent | agent2@realestate.com      | Agent123!  |
| User  | user1@example.com          | User123!   |
| User  | user2@example.com          | User123!   |

## Features to Test

### As Admin (admin@realestate.com)

1. **Dashboard Analytics**
   - View property statistics (approved, pending, rejected)
   - See agent performance metrics
   - Check revenue data and top agents

2. **Agent Management**
   - Navigate to Admin > Agents
   - Create new agent (generates temporary password)
   - Update agent details
   - View agent performance
   - Delete agents

3. **Property Moderation**
   - Navigate to Admin > Properties
   - View pending properties
   - Approve properties
   - Reject properties with reasons
   - View all properties by status

### As Agent (agent1@realestate.com)

1. **Property Management**
   - List new properties
   - View own properties (all statuses)
   - Edit property details
   - Submit properties for approval
   - See approval/rejection status

2. **Booking Management**
   - View booking requests for your properties
   - Confirm/cancel bookings
   - Add notes to bookings
   - See booking schedule

### As User (user1@example.com)

1. **Browse Properties**
   - View approved properties
   - Search and filter
   - See property details

2. **Favorites**
   - Add properties to favorites
   - Remove from favorites
   - Get notifications when favorite properties are updated

3. **Book Viewings**
   - Book property visits
   - Select date and time
   - Add messages
   - View booking status

4. **Notifications**
   - Receive notifications for:
     - Booking status changes
     - Favorite property updates
     - Price changes
   - Mark as read
   - View notification history

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user

### Admin
- `POST /api/admin/agents` - Create agent
- `GET /api/admin/agents` - List agents
- `PATCH /api/admin/agents/:id` - Update agent
- `DELETE /api/admin/agents/:id` - Delete agent
- `GET /api/admin/properties/pending` - Pending properties
- `POST /api/admin/properties/:id/approve` - Approve property
- `POST /api/admin/properties/:id/reject` - Reject property
- `GET /api/admin/dashboard/stats` - Dashboard analytics
- `GET /api/admin/agents/:id/performance` - Agent performance

### Properties
- `POST /api/properties` - Create property
- `GET /api/properties` - List approved properties
- `GET /api/properties/mine` - Agent's properties
- `GET /api/properties/:id` - Get property details
- `PATCH /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User's bookings
- `GET /api/bookings/agent-bookings` - Agent's bookings
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### User
- `POST /api/users/favorites` - Add to favorites
- `DELETE /api/users/favorites/:propertyId` - Remove favorite
- `GET /api/users/favorites` - Get favorites
- `GET /api/users/notifications` - Get notifications
- `PATCH /api/users/notifications/:id/read` - Mark as read
- `POST /api/users/notifications/read-all` - Mark all as read

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution**: Kill the process using the port or change PORT in `.env`

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Reset database
cd server
mongo real_estate_pro --eval "db.dropDatabase()"
npm run seed
```

## Project Structure

```
project/
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, error handling
│   │   ├── services/      # Business logic
│   │   ├── scripts/       # Seed script
│   │   └── app.ts         # Express app setup
│   ├── .env               # Environment variables
│   └── package.json
│
└── client/                # Next.js frontend
    ├── src/
    │   ├── app/           # Pages
    │   ├── components/    # React components
    │   ├── lib/           # Utilities, API client
    │   └── types/         # TypeScript types
    └── package.json
```

## Development Tips

1. **Testing Authentication Flow**
   - Register fails if email exists
   - Login returns JWT token
   - Token expires in 15 minutes
   - Refresh token lasts 7 days

2. **Property Workflow**
   - Agent creates → Status: "pending"
   - Admin approves → Status: "approved" (visible to users)
   - Admin rejects → Status: "rejected" (agent can edit & resubmit)

3. **Notifications**
   - Auto-sent when:
     - Booking created/updated
     - Property approved/rejected
     - Favorite property price changes
     - Favorite property updated

4. **Using MongoDB Compass**
   - Connect to `mongodb://localhost:27017`
   - Database: `real_estate_pro`
   - Collections: users, properties, bookings, notifications, agents

## Next Steps

1. **Production Deployment**
   - Use environment-specific `.env` files
   - Update `ACCESS_TOKEN_SECRET` with secure random string
   - Configure CORS for production domain
   - Set up MongoDB Atlas or production database
   - Add file upload for property images

2. **Additional Features**
   - Email notifications
   - SMS reminders for bookings
   - Advanced property search filters
   - Property comparison
   - Agent ratings and reviews
   - Payment integration
   - Document management

## Support

For issues or questions:
1. Check the console logs (browser & server)
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Check the API endpoint documentation above
