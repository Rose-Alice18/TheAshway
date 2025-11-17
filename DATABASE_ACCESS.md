# Database Access Guide

This guide explains how to access and manage your database both locally and in the cloud.

---

## Current Setup (Local MongoDB)

Your current database is running locally on your computer.

### Connection Details
- **Host**: localhost
- **Port**: 27017
- **Database Name**: theashway
- **Connection String**: `mongodb://localhost:27017/theashway`

### How to Access Locally

#### Option 1: MongoDB Compass (Recommended - Visual Interface)

1. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/try/download/compass
   - Download and install for Windows

2. **Connect to Database**
   - Open MongoDB Compass
   - Connection String: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Your Data**
   - Click on "theashway" database
   - You'll see collections:
     - `deliveryrequests` - All delivery requests
     - `rides` - All ride pairing requests
     - `drivers` - Driver listings
     - `vendors` - Service vendor listings

4. **Edit Data**
   - Click on any collection
   - Click on a document to view details
   - Click "Edit" to modify
   - Click "Delete" to remove

#### Option 2: MongoDB Shell (Command Line)

1. **Open Command Prompt/Terminal**

2. **Connect to MongoDB**
   ```bash
   mongosh
   ```

3. **Switch to Database**
   ```bash
   use theashway
   ```

4. **View Collections**
   ```bash
   show collections
   ```

5. **Query Data**
   ```bash
   # View all delivery requests
   db.deliveryrequests.find().pretty()

   # View all rides
   db.rides.find().pretty()

   # Count documents
   db.deliveryrequests.countDocuments()

   # Find specific delivery
   db.deliveryrequests.findOne({ name: "Kwame Asante" })
   ```

6. **Update Data**
   ```bash
   # Update delivery status
   db.deliveryrequests.updateOne(
     { name: "Kwame Asante" },
     { $set: { status: "delivered" } }
   )
   ```

7. **Delete Data**
   ```bash
   # Delete specific delivery
   db.deliveryrequests.deleteOne({ name: "Kwame Asante" })

   # Delete all pending deliveries
   db.deliveryrequests.deleteMany({ status: "pending" })
   ```

---

## Cloud Database (MongoDB Atlas)

For production deployment, you'll use MongoDB Atlas (cloud-hosted MongoDB).

### Benefits of MongoDB Atlas
- ✅ Access your database from anywhere
- ✅ No need to keep your computer running
- ✅ Built-in backups and monitoring
- ✅ Free tier: 512MB storage
- ✅ Automatic scaling
- ✅ Better security

### Setup MongoDB Atlas

Follow the detailed steps in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#step-1-set-up-mongodb-atlas-cloud-database)

**Quick Summary:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update `.env` file with connection string

### Access MongoDB Atlas

#### Option 1: MongoDB Compass

1. **Get Connection String from Atlas**
   - Login to MongoDB Atlas
   - Click "Connect" on your cluster
   - Choose "Connect with MongoDB Compass"
   - Copy the connection string

2. **Connect via Compass**
   - Open MongoDB Compass
   - Paste connection string
   - Replace `<password>` with your actual password
   - Click "Connect"

3. **Manage Data**
   - Same interface as local database
   - All collections visible
   - Full CRUD operations

#### Option 2: Atlas Web Interface

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Sign in

2. **Navigate to Collections**
   - Click "Database" in sidebar
   - Click "Browse Collections" on your cluster

3. **View and Edit Data**
   - Select database: `theashway`
   - View any collection
   - Click on documents to edit
   - Use filters to search

#### Option 3: MongoDB Shell (Cloud)

```bash
# Connect to Atlas
mongosh "mongodb+srv://your-cluster.mongodb.net/theashway" --username ashway_admin

# Use same commands as local database
```

---

## Database Collections Explained

### 1. deliveryrequests
**Purpose**: Stores all delivery requests submitted by users

**Fields**:
- `name`: Customer name
- `contact`: Phone number
- `itemDescription`: What needs to be delivered
- `pickupPoint`: Pickup location
- `dropoffPoint`: Delivery destination
- `deliveryType`: instant / next-day / weekly-station
- `notes`: Special instructions
- `status`: pending / authorized / assigned / in-progress / delivered / cancelled
- `authorizedBy`: Admin who authorized (if applicable)
- `authorizedAt`: Authorization timestamp
- `assignedRider`: Rider name (if assigned)
- `assignedAt`: Assignment timestamp
- `createdAt`: Request creation time

**Example Query**:
```javascript
// Find all pending deliveries
db.deliveryrequests.find({ status: "pending" })

// Find deliveries assigned to specific rider
db.deliveryrequests.find({ assignedRider: "Kwame Mensah" })

// Find deliveries from last 7 days
db.deliveryrequests.find({
  createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})
```

### 2. rides
**Purpose**: Stores ride pairing requests

**Fields**:
- `name`: Creator name
- `phone`: Phone number
- `whatsapp`: WhatsApp number
- `email`: Email address
- `pickupLocation`: Where ride starts
- `destination`: Where ride ends
- `date`: Preferred date
- `time`: Preferred time
- `seatsNeeded`: Seats needed by creator (1-4)
- `availableSeats`: Remaining seats (4 - seatsNeeded)
- `joinedUsers`: Array of people who joined
  - `name`, `phone`, `whatsapp`, `email`, `seatsNeeded`
- `createdAt`: When ride was posted

**Example Query**:
```javascript
// Find rides with available seats
db.rides.find({ availableSeats: { $gt: 0 } })

// Find rides going to Ashesi
db.rides.find({ destination: /Ashesi/i })

// Find my rides
db.rides.find({ phone: "0244567890" })
```

### 3. drivers
**Purpose**: Registered taxi drivers

**Fields**:
- `name`: Driver name
- `phone`: Phone number
- `whatsapp`: WhatsApp number
- `vehicleType`: Car type/model
- `licensePlate`: Vehicle registration
- `rating`: Average rating (1-5)
- `verified`: Boolean
- `available`: Boolean

### 4. vendors
**Purpose**: Local service providers

**Fields**:
- `name`: Business/vendor name
- `category`: Service category
- `phone`: Contact number
- `whatsapp`: WhatsApp number
- `location`: Business location
- `description`: Service description
- `rating`: Average rating
- `verified`: Boolean

---

## Common Database Tasks

### View Today's Deliveries
```javascript
const today = new Date();
today.setHours(0,0,0,0);

db.deliveryrequests.find({
  createdAt: { $gte: today }
})
```

### Export Data to JSON
```bash
# Export all deliveries
mongoexport --db=theashway --collection=deliveryrequests --out=deliveries.json

# Export specific query
mongoexport --db=theashway --collection=deliveryrequests --query='{"status":"pending"}' --out=pending_deliveries.json
```

### Import Data from JSON
```bash
mongoimport --db=theashway --collection=deliveryrequests --file=deliveries.json
```

### Backup Database
```bash
# Backup entire database
mongodump --db=theashway --out=./backup

# Restore database
mongorestore --db=theashway ./backup/theashway
```

### Clear Test Data
```javascript
// Delete all test deliveries
db.deliveryrequests.deleteMany({
  name: { $in: ["Kwame Asante", "Ama Serwaa", "Kofi Mensah"] }
})

// Delete old rides (older than 7 days)
const sevenDaysAgo = new Date(Date.now() - 7*24*60*60*1000);
db.rides.deleteMany({
  createdAt: { $lt: sevenDaysAgo }
})
```

---

## Database Monitoring

### Check Database Size
```javascript
// In MongoDB Shell
db.stats()

// Check specific collection size
db.deliveryrequests.stats()
```

### Monitor in Atlas
1. Login to MongoDB Atlas
2. Go to "Metrics" tab
3. View:
   - Storage size
   - Number of connections
   - Operations per second
   - Network usage

---

## Security Best Practices

1. **Never Commit Database Credentials**
   - Keep `.env` file in `.gitignore`
   - Never share connection strings publicly

2. **Use Strong Passwords**
   - For MongoDB Atlas users
   - Change default admin password

3. **Regular Backups**
   - Atlas provides automatic backups
   - Export important data regularly

4. **Monitor Access**
   - Check Atlas logs for unusual activity
   - Review connection logs

---

## Troubleshooting

### Can't Connect to Local MongoDB
- Ensure MongoDB service is running
- Check if port 27017 is open
- Restart MongoDB service

### Can't Connect to Atlas
- Check internet connection
- Verify connection string is correct
- Ensure IP is whitelisted (0.0.0.0/0)
- Check username and password

### Data Not Showing in Admin Panel
- Verify backend is connected to correct database
- Check MongoDB connection in backend logs
- Ensure collections exist and have data

---

## Quick Reference

| Task | Local | Atlas |
|------|-------|-------|
| Connection String | `mongodb://localhost:27017/theashway` | `mongodb+srv://user:pass@cluster.mongodb.net/theashway` |
| Access Tool | MongoDB Compass | MongoDB Compass or Atlas UI |
| Backup | `mongodump` | Automatic (Atlas) |
| Monitor | MongoDB Shell | Atlas Dashboard |
| Cost | Free | Free (512MB) |

---

## Need Help?

- MongoDB Manual: https://docs.mongodb.com/manual/
- MongoDB Compass Docs: https://docs.mongodb.com/compass/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB University (Free Courses): https://university.mongodb.com/

---

**Your Current Database Info:**
- Local: `mongodb://localhost:27017/theashway`
- Collections: deliveryrequests, rides, drivers, vendors
- Access: MongoDB Compass or MongoDB Shell
