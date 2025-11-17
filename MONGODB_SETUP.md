# 🗄️ MongoDB Atlas Setup Guide - The Ashway

Your app now uses **MongoDB** for real database storage! Follow these steps to set up MongoDB Atlas (free cloud database).

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or create an account
3. **It's FREE** - choose the Free Tier

### Step 2: Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE tier** (M0 Sandbox)
3. Select a cloud provider region (choose closest to Ghana):
   - **AWS** → **eu-west-1** (Ireland) or **us-east-1** (US)
   - **Google Cloud** → **europe-west1** (Belgium)
4. Name your cluster (e.g., "TheAshway")
5. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `ashway_admin`
5. Password: **Generate a secure password** (copy it!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production: Add specific IPs only
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** tab
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **Driver**: Node.js, **Version**: 4.1 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://ashway_admin:<password>@theashway.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

1. Open `c:\Users\HP\Downloads\TheAshWay\.env`
2. Replace `<password>` in connection string with your actual password
3. Update:
   ```env
   MONGODB_URI=mongodb+srv://ashway_admin:YOUR_PASSWORD_HERE@theashway.xxxxx.mongodb.net/theashway?retryWrites=true&w=majority
   ```

### Step 7: Seed the Database

```bash
cd c:\Users\HP\Downloads\TheAshWay
node backend/seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Inserted 6 drivers
✅ Inserted 8 vendors
🎉 Database seeding completed successfully!
```

---

## ✅ Verification

### Test the Connection

1. **Stop current servers** (if running):
   - Press `Ctrl+C` in both terminal windows

2. **Restart backend**:
   ```bash
   cd c:\Users\HP\Downloads\TheAshWay
   node backend/server.js
   ```

3. **You should see**:
   ```
   ✅ MongoDB Connected: theashway-shard-00-00.xxxxx.mongodb.net
   📊 Database: theashway
   🚀 The Ashway server is running on port 5000
   ```

4. **Test API**:
   - Open browser: `http://localhost:5000/api/drivers`
   - You should see 6 drivers with MongoDB `_id` fields!

---

## 🌍 Production Deployment

### For Vercel (Frontend)

1. In Vercel dashboard, go to **Environment Variables**
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

### For Render/Railway (Backend)

1. In Render dashboard, go to **Environment**
2. Add these variables:
   ```
   MONGODB_URI=mongodb+srv://ashway_admin:PASSWORD@theashway.xxxxx.mongodb.net/theashway?retryWrites=true&w=majority
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   DEVELOPER_EMAIL=dev@theashway.com
   NODE_ENV=production
   ```

3. After first deployment, run seed script once:
   ```bash
   # In Render console or via SSH
   node backend/seed.js
   ```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use strong passwords
- Whitelist specific IPs in production
- Use environment variables (never commit .env)
- Rotate database passwords regularly
- Enable MongoDB Atlas monitoring

### ❌ DON'T:
- Commit `.env` file to git
- Use "Allow from Anywhere" in production
- Share database credentials publicly
- Use same password for multiple services

---

## 📊 MongoDB Atlas Dashboard

### What You Can Do:
- **Browse Collections**: See your data
- **Monitor Performance**: Query stats, connections
- **Set Up Backups**: Auto-backups (paid tiers)
- **View Metrics**: Database size, operations/sec
- **Create Indexes**: Speed up queries

### Access Dashboard:
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click your cluster → **"Browse Collections"**
3. See your data:
   - `drivers` collection
   - `vendors` collection
   - `rides` collection
   - `deliveryrequests` collection

---

## 🔧 Troubleshooting

### "MongooseServerSelectionError"
**Problem**: Can't connect to MongoDB
**Solutions**:
1. Check internet connection
2. Verify MONGODB_URI in .env is correct
3. Check Network Access whitelist in Atlas
4. Ensure cluster is not paused (free tier auto-pauses after inactivity)

### "Authentication failed"
**Problem**: Wrong password
**Solutions**:
1. Check password in .env matches Atlas
2. Ensure no special characters are URL-encoded
3. Reset password in Atlas if needed

### "IP not whitelisted"
**Problem**: Your IP blocked
**Solutions**:
1. Add current IP in Network Access
2. Or use "Allow from Anywhere" (development only)

### "Cannot find module 'mongoose'"
**Problem**: Dependencies not installed
**Solution**:
```bash
npm install
```

---

## 📈 Scaling Up

### Free Tier Limits:
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Perfect for MVP/testing
- ✅ Handles ~100-500 users easily

### When to Upgrade:
- More than 512 MB data
- Need dedicated resources
- Want auto-backups
- Require 99.95% uptime SLA

### Upgrade Options:
- **M2** - $9/month (2 GB)
- **M5** - $25/month (5 GB)
- **M10+** - Custom pricing

---

## 🆘 Need Help?

- MongoDB Docs: [docs.mongodb.com](https://docs.mongodb.com/)
- Community Forum: [mongodb.com/community/forums](https://www.mongodb.com/community/forums/)
- YouTube: Search "MongoDB Atlas tutorial"

---

## ✨ What Changed?

### Before (JSON Files):
```javascript
// Reading from file
const drivers = JSON.parse(fs.readFileSync('drivers.json'));
```

### After (MongoDB):
```javascript
// Reading from database
const drivers = await Driver.find();
```

### Benefits:
- ✅ **Scalable**: Handles millions of records
- ✅ **Fast**: Indexed queries
- ✅ **Reliable**: Auto-backups, replication
- ✅ **Cloud-hosted**: Access from anywhere
- ✅ **Production-ready**: Used by major apps

---

**Your app is now production-ready with real database storage!** 🎉

*"E don set for deployment!"* 🚀🇬🇭

