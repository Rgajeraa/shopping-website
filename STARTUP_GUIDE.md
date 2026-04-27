#  E-Commerce MERN Startup Guide

##  If Your App is in Infinite Load State

### Step 1: Check if MongoDB is Running
**Windows:**
```bash
# Open a terminal and run:
mongod
```
You should see: `"waiting for connections on port 27017"`

If MongoDB is not installed:
- Install from: https://www.mongodb.com/try/download/community
- Or use: `npm install -g mongo`

---

### Step 2: Start the Backend Server
```bash
cd f:\ecommerce-mern\backend
npm install
node server.js
```

You should see:
```
✅ MongoDB Connected
Server running on port 5000
```

---

### Step 3: Start the Frontend
**In a NEW terminal:**
```bash
cd f:\ecommerce-mern\backend\frontend
npm install
npm start
```

This should open http://localhost:3000 in your browser.

---

##  Troubleshooting

### App is still loading forever
1. **Check Browser Console** (F12 → Console)
   - Look for red error messages
   - You should see: `"❌ Connection error. Make sure backend is running on port 5000"`

2. **Make sure MongoDB is running**
   ```bash
   mongod
   ```
   Terminal should say: `"waiting for connections on port 27017"`

3. **Make sure Backend Server is running**
   - Should say: `"✅ MongoDB Connected"` and `"Server running on port 5000"`

4. **Clear browser cache**
   - Press: `Ctrl + Shift + Delete`
   - Select: "Cached images and files"
   - Click: "Clear data"
   - Reload the page

### Error: "Cannot POST /uploads"
- Make sure you have an `uploads/` folder in the backend directory
```bash
mkdir f:\ecommerce-mern\backend\uploads
```

### Error: "Cannot find module 'xyz'"
Install missing dependencies:
```bash
cd f:\ecommerce-mern\backend
npm install

cd f:\ecommerce-mern\backend\frontend
npm install
```

---

##  How to Know Everything is Working

1. Backend Terminal should show:
   ```
   ✅ MongoDB Connected
   Server running on port 5000
   ```

2. Frontend should load at http://localhost:3000

3. Products should load without errors

4. Shop page should display products in a grid

5. No red errors in browser console (F12)

---

##  Quick Reference

| Issue | Solution |
|-------|----------|
| Infinite load | Start mongod + node server.js |
| "Cannot GET /api/products" | Backend not running on port 5000 |
| Products not showing | Check MongoDB and backend logs |
| Images not loading | Make sure uploads folder exists |
| "Module not found" | Run npm install in that folder |

---

##  Useful Ports

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

##  Common Commands

```bash
# Start everything (in separate terminals)
mongod                          # Terminal 1
cd backend && node server.js    # Terminal 2
cd frontend && npm start        # Terminal 3
```

For more help, check browser console (F12 → Console tab) for error messages.
