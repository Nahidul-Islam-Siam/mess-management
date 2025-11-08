# Backend Server Setup Guide

## Prerequisites

1. **MongoDB** - Make sure MongoDB is installed and running
   - Local MongoDB: `mongodb://localhost:27017/mess-management`
   - Or use MongoDB Atlas (cloud)

2. **Node.js** - Version 18 or higher

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- express
- cors
- dotenv
- mongoose
- concurrently (for running both frontend and backend)

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mess-management

# Server Port
PORT=5000

# Next.js API URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Node Environment
NODE_ENV=development
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# If MongoDB is installed locally, start the service
# Windows: Start MongoDB service from Services
# Mac/Linux: mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Run the Backend Server

**Option A: Run backend only**
```bash
npm run dev:server
```

**Option B: Run both frontend and backend together**
```bash
npm run dev:all
```

The server will start on `http://localhost:5000`

### 5. Test the API

Visit: http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "message": "Mess Management API is running"
}
```

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `PATCH /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Meals
- `GET /api/meals?month=1&year=2024` - Get meals for month/year
- `POST /api/meals` - Create/update meal entry

### Bazar
- `GET /api/bazar?month=1&year=2024` - Get bazar entries for month/year
- `POST /api/bazar` - Add new bazar entry

### Bills
- `GET /api/bills?month=1&year=2024` - Get bills for month/year
- `POST /api/bills` - Set/update bills

### Payments
- `GET /api/payments?month=1&year=2024` - Get payments for month/year
- `POST /api/payments` - Add new payment

### Report
- `GET /api/report?month=1&year=2024` - Get monthly report with calculations

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB connection string is correct

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### CORS Errors
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env` matches backend URL

## Database Schema

The server uses MongoDB with Mongoose. Collections:
- `members` - Mess members
- `meals` - Daily meal entries
- `bazars` - Market purchases
- `bills` - Monthly bills
- `payments` - Member payments

