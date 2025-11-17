# 🚀 Quick Start Guide - The Ashway

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version
```

Don't have Node.js? Download from [nodejs.org](https://nodejs.org)

## Installation Steps

### 1. Navigate to Project
```bash
cd TheAshWay
```

### 2. Install All Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Run the App
```bash
# Run both frontend and backend together
npm run dev
```

**That's it!** 🎉

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

## What You'll See

1. **Home Page** - Welcome with all features overview
2. **Driver Finder** - 6 mock drivers ready to browse
3. **Delivery** - Request delivery form
4. **Service Hub** - 8 local vendors across 4 categories
5. **Ride Pairing** - Post and join rides

## Try These Features

### Test Driver Contact Reveal
1. Go to "Drivers" page
2. Click "View Contact" on any driver
3. Use mock payment (any phone number works)
4. Contact reveals! 🎉

### Create a Ride
1. Go to "Ride Pairing"
2. Click "Post a Ride"
3. Fill in details
4. Watch it appear in real-time!

### Request Delivery
1. Go to "Delivery"
2. Choose delivery type
3. Fill form and submit
4. See success animation!

## Common Issues

### Port Already in Use
```bash
# Kill port 3000
npx kill-port 3000

# Kill port 5000
npx kill-port 5000
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Frontend Not Loading
- Check if backend is running on port 5000
- Check browser console for errors
- Try refreshing the page

## Next Steps

- Read [README.md](README.md) for full documentation
- Configure email in `.env` for delivery notifications
- Add your own drivers/vendors in `backend/data/`
- Customize colors in `frontend/tailwind.config.js`

## Need Help?

- Check the [README](README.md)
- Open an issue on GitHub
- Email: info@theashway.com

---

**Enjoy building with The Ashway!** 🇬🇭

*"E be like say you ready to move? Make we go!"* 🚗💨
