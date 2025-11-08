# 🚀 How to Start the Backend Server

## Step 1: Setup Environment

Create a `.env` file in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/mess-management
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

## Step 2: Make sure MongoDB is Running

**Option A: Local MongoDB**
- Start MongoDB service on your computer
- Default connection: `mongodb://localhost:27017/mess-management`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start the Server

**Run backend only:**
```bash
npm run dev:server
```

**Run both frontend and backend:**
```bash
npm run dev:all
```

## Step 5: Verify

Open browser: http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "message": "Mess Management API is running"
}
```

## ✅ Success!

If you see the health check response, your backend is running successfully!

Now you can:
1. Start the frontend: `npm run dev`
2. Open http://localhost:3000
3. Start using the mess management system!

