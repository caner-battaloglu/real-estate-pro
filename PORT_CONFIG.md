# Port Configuration - Updated to 3001

## ✅ Changes Made

All configurations have been updated to use port **3001** for the backend server.

### Files Updated

1. **`client/src/lib/api.ts`**
   - Changed default API URL from `http://localhost:4000` to `http://localhost:3001`

2. **`server/.env`** (Created)
   ```env
   PORT=3001
   MONGO_URI=mongodb://127.0.0.1:27017/real_estate_pro
   ACCESS_TOKEN_SECRET=your-secret-access-token-key-change-this-in-production
   ACCESS_TOKEN_MIN=15
   REFRESH_TOKEN_DAYS=7
   REFRESH_TOKEN_REMEMBER_DAYS=30
   CLIENT_ORIGIN=http://localhost:3000
   ```

3. **`client/.env.local`** (Created)
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## Server Configuration

The backend now runs on **port 3001** as configured in `server/.env`:
- Server URL: `http://localhost:3001`
- Frontend URL: `http://localhost:3000`

## Start Commands

```bash
# Terminal 1 - Backend (runs on port 3001)
cd server
npm run dev

# Terminal 2 - Frontend (runs on port 3000)
cd client
npm run dev
```

## API Endpoints

All API requests now go to `http://localhost:3001`:

### Test with curl
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestate.com","password":"Admin123!"}'

# Get properties (with token)
curl http://localhost:3001/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment Variables

### Backend (`server/.env`)
- `PORT=3001` - Server port
- `MONGO_URI` - MongoDB connection
- `ACCESS_TOKEN_SECRET` - JWT secret
- `CLIENT_ORIGIN` - CORS origin

### Frontend (`client/.env.local`)
- `NEXT_PUBLIC_API_URL=http://localhost:3001` - Backend API URL

## Troubleshooting

### Port Already in Use
If port 3001 is already in use:
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change the port in server/.env
PORT=3002
```

### CORS Issues
Make sure `CLIENT_ORIGIN` in `server/.env` matches your frontend URL:
```env
CLIENT_ORIGIN=http://localhost:3000
```

### API Connection Failed
1. Verify backend is running on port 3001
2. Check `client/.env.local` has correct URL
3. Restart both frontend and backend after changing ports

## Summary

✅ Backend: `http://localhost:3001`
✅ Frontend: `http://localhost:3000`
✅ API calls: Point to port 3001
✅ Environment files: Created with correct ports
✅ All imports: Using correct API base URL

Your application is now configured to use port 3001 for the backend! 🎉
