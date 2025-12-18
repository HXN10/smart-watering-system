# MongoDB Setup Guide

## 🎯 Why MongoDB?

Currently, your data is stored **in memory** and is **lost when the server shuts down**. MongoDB provides **persistent storage** - your data survives server restarts!

## 🚀 Quick Setup

### Option 1: Using Docker (Recommended)

1. **Start MongoDB:**
   ```bash
   cd smart-watering-system
   docker-compose up mongo -d
   ```

2. **Set Environment Variable:**
   ```bash
   export MONGO_URI="mongodb://localhost:27017/watering"
   ```

3. **Restart your backend server:**
   ```bash
   # Stop current server (Ctrl+C or pkill)
   cd smart-watering-system/backend
   npm run dev
   ```

4. **Verify Connection:**
   - Check backend logs - you should see: `✅ Connected to MongoDB`
   - Visit: http://localhost:3001/api/admin/db

### Option 2: Install MongoDB Locally

1. **Install MongoDB:**
   - macOS: `brew install mongodb-community`
   - Or download from: https://www.mongodb.com/try/download/community

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   # Or: mongod --config /usr/local/etc/mongod.conf
   ```

3. **Set Environment Variable:**
   ```bash
   export MONGO_URI="mongodb://localhost:27017/watering"
   ```

4. **Restart backend server**

## 📊 View Your Database

### Using MongoDB Compass (GUI - Recommended)
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse database: `watering`
4. Collections: `users`, `plants`

### Using Command Line
```bash
# Install mongosh if needed
brew install mongosh

# Connect to database
mongosh mongodb://localhost:27017/watering

# View collections
show collections

# View users
db.users.find().pretty()

# View plants
db.plants.find().pretty()
```

## 🔄 How It Works

- **With MongoDB:** Data is saved to disk, persists across restarts
- **Without MongoDB:** Falls back to in-memory storage (data lost on restart)

The app automatically detects if MongoDB is connected and uses it if available!

## ✅ Verify It's Working

1. Create a user account
2. Add some plants
3. Stop the server (`Ctrl+C`)
4. Start the server again
5. **Your data should still be there!** 🎉

## 🗄️ Database Location (Docker)

If using Docker, data is stored in a Docker volume:
```bash
docker volume ls  # Find mongo-data volume
docker volume inspect smart-watering-system_mongo-data
```

## 🔒 Security Note

**Important:** Passwords are currently stored in plain text. For production, you should:
- Use `bcrypt` to hash passwords
- Add authentication middleware
- Use environment variables for sensitive data

