const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Driver = require('./models/Driver');
const Vendor = require('./models/Vendor');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/theashway', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await Driver.deleteMany({});
    await Vendor.deleteMany({});
    console.log('🗑️  Cleared existing data\n');

    // Read JSON files
    const driversData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/drivers.json'), 'utf8')
    );
    const vendorsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/vendors.json'), 'utf8')
    );

    // Insert drivers (removing old 'id' field)
    const drivers = driversData.map(({ id, ...rest }) => rest);
    await Driver.insertMany(drivers);
    console.log(`✅ Inserted ${drivers.length} drivers`);

    // Insert vendors (removing old 'id' field)
    const vendors = vendorsData.map(({ id, ...rest }) => rest);
    await Vendor.insertMany(vendors);
    console.log(`✅ Inserted ${vendors.length} vendors`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nYou can now start the server with: node backend/server.js\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

// Run the seeding process
connectDatabase().then(seedDatabase);
