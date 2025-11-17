# The Ashway - Deployment Guide

This guide will help you deploy The Ashway application to production.

## Architecture Overview

- **Frontend**: React app (deploy to Vercel or Netlify)
- **Backend**: Node.js/Express API (deploy to Render or Railway)
- **Database**: MongoDB (use MongoDB Atlas for cloud hosting)

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

### Why MongoDB Atlas?
- Free tier available (512MB storage)
- Accessible from anywhere
- No need to run MongoDB locally in production
- Built-in backups and monitoring

### Setup Instructions:

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and create an account
   - Sign in with Google or email

2. **Create a Cluster**
   - Choose "FREE" tier (M0)
   - Select a cloud provider: AWS
   - Choose region closest to you (or your users)
   - Cluster name: `theashway-cluster`
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `ashway_admin`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Addresses**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   - ⚠️ Note: For production, use specific IPs for better security

5. **Get Connection String**
   - Go to "Database" (Clusters)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy the connection string (looks like):
     ```
     mongodb+srv://ashway_admin:<password>@theashway-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name at the end: `/theashway`
   - Final format:
     ```
     mongodb+srv://ashway_admin:YOUR_PASSWORD@theashway-cluster.xxxxx.mongodb.net/theashway?retryWrites=true&w=majority
     ```

6. **Access Your Database**
   - You can view/edit data using MongoDB Compass
   - Download: https://www.mongodb.com/products/compass
   - Connect using the same connection string

---

## Step 2: Deploy Backend to Render

### Why Render?
- Free tier available
- Easy deployment from GitHub
- Automatic HTTPS
- Environment variables support

### Setup Instructions:

1. **Prepare Backend**
   - Make sure your backend has a `package.json` with start script
   - Create `.gitignore` if not exists (should exclude `node_modules`, `.env`)

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Public Git Repository" if not on GitHub yet

4. **Configure Service**
   - Name: `theashway-api`
   - Region: Choose closest to you
   - Branch: `main` or `master`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start` or `node server.js`
   - Plan: Free

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:

   ```
   MONGODB_URI=mongodb+srv://ashway_admin:YOUR_PASSWORD@theashway-cluster.xxxxx.mongodb.net/theashway
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   DEVELOPER_EMAIL=developer@theashway.com
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - You'll get a URL like: `https://theashway-api.onrender.com`
   - Test it by visiting: `https://theashway-api.onrender.com/`

---

## Step 3: Deploy Frontend to Vercel

### Why Vercel?
- Free for personal projects
- Automatic deployments from GitHub
- Built-in CI/CD
- Free SSL certificates

### Setup Instructions:

1. **Update API URLs in Frontend**

   Create a `.env.production` file in the frontend folder:
   ```
   REACT_APP_API_URL=https://theashway-api.onrender.com
   ```

   Then update all axios calls to use this:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   axios.get(`${API_URL}/api/drivers`)
   ```

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Or upload the frontend folder

4. **Configure Project**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://theashway-api.onrender.com
     ```

6. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - You'll get a URL like: `https://theashway.vercel.app`

7. **Update Backend CORS**
   - Go back to Render → Your backend service
   - Update `FRONTEND_URL` environment variable to your Vercel URL
   - Service will auto-redeploy

---

## Alternative: Deploy to Netlify (Frontend)

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository

3. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

4. **Add Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add: `REACT_APP_API_URL=https://theashway-api.onrender.com`

5. **Deploy**
   - Click "Deploy site"
   - Get URL like: `https://theashway.netlify.app`

---

## Alternative: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - Railway auto-detects Node.js
   - Add environment variables in the "Variables" tab
   - Same variables as Render above

4. **Deploy**
   - Automatic deployment
   - Get URL in Settings → Domains

---

## Step 4: Test Your Deployment

1. **Test Backend**
   ```bash
   curl https://theashway-api.onrender.com/
   curl https://theashway-api.onrender.com/api/drivers
   ```

2. **Test Frontend**
   - Visit your Vercel/Netlify URL
   - Try all features:
     - Driver finder
     - Delivery request
     - Service hub
     - Ride pairing
     - Admin login

3. **Test Admin Panel**
   - Login with password: `ashway2025`
   - Submit a test delivery request
   - Check if it appears in admin dashboard

---

## Updating Your Live Site

### Frontend (Vercel/Netlify)
- Push changes to GitHub → Auto-deploys
- Or redeploy manually in dashboard

### Backend (Render/Railway)
- Push changes to GitHub → Auto-deploys
- Or trigger manual deploy in dashboard

---

## Costs

| Service | Free Tier | Paid Plans Start At |
|---------|-----------|-------------------|
| MongoDB Atlas | 512MB storage | $9/month (10GB) |
| Render | 750 hours/month | $7/month |
| Vercel | Unlimited personal projects | $20/month (team) |
| Netlify | 100GB bandwidth/month | $19/month |
| Railway | $5 free credit/month | Pay as you go |

---

## Security Checklist

- ✅ Use strong MongoDB password
- ✅ Never commit `.env` files to GitHub
- ✅ Use environment variables for all secrets
- ✅ Enable CORS only for your frontend domain
- ✅ Use HTTPS everywhere (automatic with Vercel/Render)
- ✅ Change default admin password in production
- ⚠️ Consider IP whitelisting for MongoDB in production

---

## Monitoring & Maintenance

### MongoDB Atlas
- Check database size in Atlas dashboard
- Monitor queries and performance
- Set up alerts for storage limits

### Render/Railway
- Check logs for errors
- Monitor response times
- Set up uptime monitoring (UptimeRobot, Pingdom)

### Vercel/Netlify
- Check build logs
- Monitor bandwidth usage
- Review error reports

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check connection string is correct
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials

### Frontend can't reach backend
- Verify REACT_APP_API_URL is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

### Admin page not loading
- Check admin authentication in browser console
- Verify routes are configured correctly
- Clear browser localStorage if needed

---

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app

---

## Your Current Setup (Local Development)

- Frontend: http://localhost:2000
- Backend: http://localhost:5000
- Database: MongoDB local (mongodb://localhost:27017/theashway)
- Admin Password: `ashway2025`

**Remember to change the admin password before deploying to production!**
