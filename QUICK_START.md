# The Ashway - Quick Start Guide

## For Immediate Database Access

### Option 1: MongoDB Compass (Easiest - Visual Interface)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Open Compass
3. Connection string: `mongodb://localhost:27017`
4. Click "Connect"
5. Click "theashway" database
6. View your collections:
   - `deliveryrequests` - See all delivery orders
   - `rides` - See all ride requests
   - `drivers` - See all drivers
   - `vendors` - See all service vendors

**You can now view, edit, and delete any data!**

---

## For Cloud Database (Production)

### Step 1: Create MongoDB Atlas Account (5 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with Google or email
4. Verify email

### Step 2: Create Cluster (3-5 minutes wait)
1. Choose FREE tier (M0)
2. Provider: AWS
3. Region: Choose closest to you
4. Click "Create Cluster"
5. ☕ Wait 3-5 minutes for cluster creation

### Step 3: Create Database User (1 minute)
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `ashway_admin`
4. Password: Create strong password (SAVE THIS!)
5. Permissions: "Read and write to any database"
6. Click "Add User"

### Step 4: Allow Network Access (1 minute)
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String (1 minute)
1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add `/theashway` at the end

Example:
```
mongodb+srv://ashway_admin:MyPassword123@cluster.xxxxx.mongodb.net/theashway
```

### Step 6: Use It!

**In MongoDB Compass:**
- Paste the connection string
- Click "Connect"
- You're in!

**In Your Backend (.env file):**
```
MONGODB_URI=mongodb+srv://ashway_admin:MyPassword123@cluster.xxxxx.mongodb.net/theashway
```

**Now restart your backend and it will use the cloud database!**

---

## For Deployment

### Backend → Render (Free)
1. Create account: https://render.com (sign up with GitHub)
2. New Web Service → Connect GitHub repo
3. Settings:
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables (from `.env.example`)
5. Deploy!
6. Get URL: `https://theashway-api.onrender.com`

### Frontend → Vercel (Free)
1. Create account: https://vercel.com (sign up with GitHub)
2. Import project → Connect GitHub repo
3. Settings:
   - Root: `frontend`
   - Framework: Create React App
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://theashway-api.onrender.com
   ```
5. Deploy!
6. Get URL: `https://theashway.vercel.app`

**That's it! Your app is live!**

---

## Current Project Status

✅ **What's Working:**
- Driver finder
- Delivery requests
- Service hub
- Ride pairing (with flexible seats: 1-4 seats per person)
- Admin dashboard (password-protected)
- Admin can authorize deliveries
- Admin can assign riders

✅ **Admin Access:**
- URL: http://localhost:2000/admin
- Password: `ashway2025`
- ⚠️ **Change this password before deploying!**

✅ **Tech Stack:**
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MongoDB

---

## File Structure

```
TheAshWay/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── config/          # Database connection
│   ├── server.js        # Main server file
│   ├── .env.example     # Environment variables template
│   └── package.json     # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # Main pages (Home, Admin, etc.)
│   │   ├── components/  # Reusable components
│   │   └── config/      # API configuration
│   ├── .env             # Local environment (PORT=2000)
│   ├── .env.production  # Production environment
│   └── package.json     # Dependencies
│
├── DEPLOYMENT_GUIDE.md  # Full deployment instructions
├── DATABASE_ACCESS.md   # Database access guide
└── QUICK_START.md       # This file
```

---

## Important Files

### Backend Environment (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/theashway  # Or Atlas connection
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:2000
```

### Frontend Environment (.env)
```bash
PORT=2000
REACT_APP_API_URL=http://localhost:5000  # Or production URL
```

---

## Common Commands

### Start Development Servers

**Backend:**
```bash
cd backend
npm install
npm start
```
Runs on: http://localhost:5000

**Frontend:**
```bash
cd frontend
npm install
npm start
```
Runs on: http://localhost:2000

### Access Database

**MongoDB Compass:**
- Local: `mongodb://localhost:27017`
- Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/theashway`

**MongoDB Shell:**
```bash
mongosh                          # Connect to local
use theashway                    # Switch to database
db.deliveryrequests.find()       # View delivery requests
db.rides.find()                  # View rides
```

---

## Next Steps

1. **✅ Database Access**
   - Install MongoDB Compass
   - Or set up MongoDB Atlas for cloud access

2. **📝 Content**
   - Add real driver listings
   - Add real service vendors
   - Customize text and images

3. **🔐 Security**
   - Change admin password in `AdminLogin.jsx`
   - Set up proper email credentials
   - Configure MongoDB Atlas with restricted IPs (production)

4. **🚀 Deploy**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Deploy backend to Render
   - Deploy frontend to Vercel

5. **💰 Payments** (Future)
   - Integrate Paystack for payments
   - Set up mobile money (MTN/Vodafone)

---

## Getting Help

📖 **Documentation:**
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment steps
- [DATABASE_ACCESS.md](./DATABASE_ACCESS.md) - Database management
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

🌐 **External Resources:**
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev

---

## Summary

**Your project is ready for:**
- ✅ Local development (working now!)
- ✅ Cloud database (MongoDB Atlas - follow guide)
- ✅ Production deployment (Render + Vercel - follow guide)

**Total time to deploy: ~30 minutes**
- MongoDB Atlas setup: 10 minutes
- Render backend deploy: 10 minutes
- Vercel frontend deploy: 10 minutes

**Cost: $0** (All free tiers)

🎉 **You're all set!**
