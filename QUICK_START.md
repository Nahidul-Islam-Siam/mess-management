# 🚀 Quick Start Guide - Mess Management System

## Backend Setup

### 1. Create `.env` file in root directory:

```env
MONGODB_URI=mongodb://localhost:27017/mess-management
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### 2. Start MongoDB

**Windows:**
- Open Services and start MongoDB service
- OR install MongoDB and run: `mongod`

**Mac/Linux:**
```bash
mongod
```

**OR use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Backend Server

```bash
npm run dev:server
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on http://localhost:5000
📊 API Health: http://localhost:5000/api/health
```

### 5. Start Frontend (in another terminal)

```bash
npm run dev
```

### OR Run Both Together

```bash
npm run dev:all
```

## ✅ Verify Everything Works

1. **Backend Health Check:**
   - Visit: http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"Mess Management API is running"}`

2. **Frontend:**
   - Visit: http://localhost:3000
   - You should see the login page or dashboard

## 📋 API Endpoints

All endpoints are at `http://localhost:5000/api`

- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `GET /api/meals?month=1&year=2024` - Get meals
- `POST /api/meals` - Add meal
- `GET /api/bazar?month=1&year=2024` - Get bazar entries
- `POST /api/bazar` - Add bazar
- `GET /api/bills?month=1&year=2024` - Get bills
- `POST /api/bills` - Set bills
- `GET /api/payments?month=1&year=2024` - Get payments
- `POST /api/payments` - Add payment
- `GET /api/report?month=1&year=2024` - Get monthly report

## 🎯 Next Steps

1. Add members in the Members page
2. Add daily meals in the Meals page
3. Add bazar entries in the Bazar page
4. Set monthly bills in the Bills page
5. Record payments in the Payments page
6. View reports in the Reports page

## 🐛 Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Try: `mongodb://127.0.0.1:27017/mess-management`

**Port 5000 in use?**
- Change `PORT` in `.env`
- Update `NEXT_PUBLIC_API_URL` accordingly

**CORS errors?**
- Backend has CORS enabled
- Make sure backend URL matches frontend config

**API not responding?**
- Check if backend is running
- Verify MongoDB connection
- Check server console for errors

