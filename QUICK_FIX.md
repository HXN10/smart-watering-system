# Quick Fix for "Cannot GET" Error

## ✅ Server is Working!

The backend server is running and all endpoints are responding correctly.

## 🔧 The Problem

The issue is likely:
1. **Old token format** - You have an old token that doesn't work with the new system
2. **Browser cache** - Old JavaScript files are cached

## 🎯 Solution (2 minutes)

### Step 1: Clear Browser Storage
1. Open your app: http://localhost:8000/login.html
2. Press **F12** (open DevTools)
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Local Storage** → **http://localhost:8000**
5. **Delete** the `token` entry
6. **Close DevTools**

### Step 2: Log Out and Log Back In
1. If you're logged in, click **Logout**
2. Log back in with your credentials
3. This gets you a new token with the correct format

### Step 3: Hard Refresh
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

## ✅ That's It!

After these steps, everything should work:
- ✅ Plants will load
- ✅ You can add plants
- ✅ You can edit/delete plants
- ✅ Data will persist

## 🔍 Still Not Working?

Check browser console (F12 → Console tab) and share:
- Any red error messages
- What you see when you try to load plants

