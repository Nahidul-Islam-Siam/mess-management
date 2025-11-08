# Quick Start - Backend Server

## 🚀 Quick Setup

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install
   ```

2. **Create `.env` file** in root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mess-management
   PORT=5000
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NODE_ENV=development
   ```

3. **Start MongoDB**
   - Make sure MongoDB is running locally, OR
   - Use MongoDB Atlas (cloud) and update `MONGODB_URI`

4. **Run Backend Server**
   ```bash
   npm run dev:server
   ```

5. **Run Frontend** (in another terminal)
   ```bash
   npm run dev
   ```

   OR run both together:
   ```bash
   npm run dev:all
   ```

## ✅ Verify Backend is Running

Visit: http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "message": "Mess Management API is running"
}
```

## 📋 API Endpoints

All endpoints are prefixed with `/api`

- **Members**: `/api/members`
- **Meals**: `/api/meals?month=1&year=2024`
- **Bazar**: `/api/bazar?month=1&year=2024`
- **Bills**: `/api/bills?month=1&year=2024`
- **Payments**: `/api/payments?month=1&year=2024`
- **Report**: `/api/report?month=1&year=2024`

## 🔧 Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env` file
- Try: `mongodb://127.0.0.1:27017/mess-management`

**Port 5000 already in use?**
- Change `PORT` in `.env` file
- Update `NEXT_PUBLIC_API_URL` accordingly

**CORS errors?**
- Backend has CORS enabled for all origins
- Make sure backend URL matches `NEXT_PUBLIC_API_URL`

