# Quick Start Guide - Real Estate Management System

## ✅ All Issues Fixed
- TypeScript types properly defined
- CORS configured for both ports 3000 and 3001
- API endpoints correctly configured
- Zero build errors

## Your Current Configuration

```
Frontend: http://localhost:3001 (Next.js)
Backend:  http://localhost:3000 (Express)
Database: mongodb://localhost:27017 (MongoDB)
```

## Start in 3 Steps

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
# OR
brew services start mongodb-community  # macOS
sudo systemctl start mongodb          # Linux
```

### 2. Start Backend (Terminal 1)
```bash
cd server
npm install                    # First time only
npm run seed                   # First time only - creates test data
npm run dev
```

**Expected output**:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### 3. Start Frontend (Terminal 2)
```bash
cd client
npm install                    # First time only
npm run dev
```

**Expected output**:
```
✓ Ready on http://localhost:3001
```

## Test It

Visit: **http://localhost:3001**

### Test Accounts (After Running Seed)

| Role  | Email                      | Password   |
|-------|----------------------------|------------|
| Admin | admin@realestate.com       | Admin123!  |
| Agent | agent1@realestate.com      | Agent123!  |
| User  | user1@example.com          | User123!   |

## Verify It's Working

### Check 1: Backend Health
```bash
curl http://localhost:3000/health
# Should return: {"ok":true}
```

### Check 2: API Endpoint
```bash
curl http://localhost:3000/api/properties
# Should return: {"items": [...]}
```

### Check 3: Frontend
1. Open http://localhost:3001
2. Open DevTools (F12) → Console
3. Should see NO CORS errors
4. Network tab should show successful requests to `http://localhost:3000/api/*`

## Troubleshooting

### CORS Error Still Showing?
**Solution**: Restart your backend server
```bash
# In terminal 1 (backend)
# Press Ctrl+C to stop
npm run dev    # Start again
```

### Port Already in Use?
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (frontend)
lsof -ti:3001 | xargs kill -9
```

### MongoDB Not Running?
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Manual
mongod --dbpath ~/data/db
```

### Database Empty?
```bash
cd server
npm run seed
```

### Module Not Found?
```bash
# Reinstall backend
cd server
rm -rf node_modules
npm install

# Reinstall frontend
cd client
rm -rf node_modules .next
npm install
```

## What You Can Do

### As Admin (admin@realestate.com)
✅ Create/manage agents
✅ Approve/reject properties
✅ View dashboard analytics
✅ Monitor all activity

### As Agent (agent1@realestate.com)
✅ Create property listings
✅ Manage own properties
✅ Handle booking requests
✅ Track approval status

### As User (user1@example.com)
✅ Browse properties
✅ Book viewings
✅ Add to favorites
✅ Receive notifications

## API Endpoints Available

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/profile` - Get current user

### Properties
- GET `/api/properties` - Get all approved properties
- POST `/api/properties` - Create property (agent)
- GET `/api/properties/mine` - Get my properties (agent)
- PATCH `/api/properties/:id` - Update property
- DELETE `/api/properties/:id` - Delete property

### Admin
- GET `/api/admin/dashboard/stats` - Dashboard statistics
- GET `/api/admin/agents` - Get all agents
- POST `/api/admin/agents` - Create agent
- GET `/api/admin/properties/pending` - Pending properties
- POST `/api/admin/properties/:id/approve` - Approve property
- POST `/api/admin/properties/:id/reject` - Reject property

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my-bookings` - Get user bookings
- GET `/api/bookings/agent-bookings` - Get agent bookings
- PATCH `/api/bookings/:id/status` - Update booking status

### Users
- POST `/api/users/favorites` - Add to favorites
- GET `/api/users/favorites` - Get favorites
- DELETE `/api/users/favorites/:id` - Remove from favorites
- GET `/api/users/notifications` - Get notifications
- PATCH `/api/users/notifications/:id/read` - Mark as read

## Files Documentation

- **CORS_FIX.md** - Details about CORS configuration
- **PORT_UPDATE.md** - Port configuration explanation
- **QUICK_START.md** - This file
- **server/.env.example** - Environment variables template

## Need Help?

1. Check the browser console for errors
2. Check the backend terminal for errors
3. Verify MongoDB is running
4. Verify both servers are running
5. Check Network tab in DevTools

## Success Indicators

✅ Backend shows: "🚀 Server running on http://localhost:3000"
✅ Frontend shows: "✓ Ready on http://localhost:3001"
✅ No CORS errors in browser console
✅ Can login successfully
✅ Can see properties on home page
✅ Network requests return status 200

You're ready to test the application! 🎉
