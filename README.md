# 🇬🇭 The Ashway - Ashesi Community Hub

![The Ashway Banner](https://img.shields.io/badge/Made%20in-Ghana-success?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)

**The Ashway** is a modern, vibrant community platform designed for the Ashesi University community in Ghana. It connects students with local service providers, drivers, delivery services, and carpool partners - all in one place!

## ✨ Features

### 🚗 Driver Finder
- Browse available local drivers with detailed profiles
- View driver ratings, car types, and locations
- **Tip-to-reveal** system: Small tip unlocks driver contact info
- Real-time availability status
- Direct WhatsApp integration

### 📦 Delivery Request
- Request deliveries to campus with ease
- Three delivery types:
  - **Instant Delivery** (2-4 hours)
  - **Next-Day Delivery**
  - **Weekly Station Pickup**
- Email notifications to service provider
- Beautiful success animations

### 🛍️ Local Service Hub
- Find trusted local vendors:
  - 🍎 Fruit Vendors
  - 👗 Tailors/Seamstresses
  - 💈 Barbers/Hairdressers
  - 🍲 Food Vendors
- Vendor profiles with ratings and reviews
- Operating hours and price ranges
- Recommendation system

### 🚙 Ride Pairing (Carpool)
- Post rides you're offering
- Browse available rides by destination
- Filter by date (today, tomorrow, all)
- Join rides with available seats
- Real-time seat availability tracking

## 🎨 Design Philosophy

- **Culturally Relevant**: Ghanaian flag colors (red, yellow, green), Twi/pidgin microcopy
- **Gen-Z Friendly**: Emoji-rich, informal tone, playful interactions
- **Modern UI**: Tailwind CSS, Framer Motion animations, responsive design
- **Smooth UX**: Async operations, no page reloads, instant feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP requests

### Backend
- **Node.js + Express** - RESTful API
- **Nodemailer** - Email notifications
- **JSON File Storage** - Simple data persistence (easily upgradeable to MongoDB)

## 📁 Project Structure

```
TheAshWay/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PaymentModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── DriverFinder.jsx
│   │   │   ├── Delivery.jsx
│   │   │   ├── ServiceHub.jsx
│   │   │   └── RidePairing.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── drivers.js
│   │   ├── vendors.js
│   │   ├── delivery.js
│   │   ├── rides.js
│   │   └── payments.js
│   ├── data/
│   │   ├── drivers.json
│   │   ├── vendors.json
│   │   └── rides.json
│   ├── server.js
│   └── .env.example
│
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   cd TheAshWay
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Copy example env file
   cp backend/.env.example .env

   # Edit .env and add your credentials (optional for development)
   # EMAIL_USER, EMAIL_PASS, etc.
   ```

### Running the Application

#### Option 1: Run Both Servers Concurrently (Recommended)
```bash
npm run dev
```
This runs both frontend (port 3000) and backend (port 5000) simultaneously.

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run client
```
Frontend runs on `http://localhost:3000`

### Building for Production

```bash
# Build frontend
npm run build

# The build folder will be in frontend/build/
```

## 📡 API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get single driver

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/category/:category` - Get vendors by category
- `POST /api/vendors/:id/recommend` - Recommend a vendor

### Delivery
- `POST /api/delivery/request` - Submit delivery request

### Rides
- `GET /api/rides` - Get all rides
- `POST /api/rides/create` - Create new ride
- `POST /api/rides/:id/join` - Join a ride
- `DELETE /api/rides/:id` - Delete a ride

### Payments
- `POST /api/payments/tip` - Process tip payment (mock)

## 🎭 Mock Data

The app comes with pre-populated mock data:

- **6 Drivers** with varied availability statuses
- **8 Vendors** across 4 categories (fruit, tailor, barber, food)
- **Empty rides array** (users can create their own)

All data is stored in JSON files under `backend/data/`.

## 💳 Payment Integration

Currently uses **mock payment processing**. For production:

### Paystack Integration
1. Sign up at [paystack.com](https://paystack.com)
2. Get API keys from dashboard
3. Add to `.env`:
   ```
   PAYSTACK_SECRET_KEY=sk_test_xxxxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
   ```
4. Update `backend/routes/payments.js` with real Paystack API calls

### Mobile Money Integration
1. Register with MTN/Vodafone Mobile Money API
2. Add credentials to `.env`
3. Implement API calls in payments route

## 📧 Email Notifications

Delivery requests send email notifications. To enable:

1. Create a Gmail App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

2. Update `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   DEVELOPER_EMAIL=where-to-receive@emails.com
   ```

## 🎨 Customization

### Colors (Tailwind Config)
Edit `frontend/tailwind.config.js` to customize:
- Ghana colors (red, yellow, green)
- Ashesi branding colors
- Animations

### Mock Data
Edit JSON files in `backend/data/`:
- Add/remove drivers
- Add/remove vendors
- Modify profiles, ratings, locations

### Features
Add new features by:
1. Creating new page in `frontend/src/pages/`
2. Adding route in `frontend/src/App.js`
3. Creating backend route in `backend/routes/`
4. Updating navbar in `frontend/src/components/Navbar.jsx`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 5000 (backend)
npx kill-port 5000
```

### CORS Errors
Make sure backend is running and frontend is configured to proxy to `http://localhost:5000`

### Email Not Sending
This is expected without proper configuration. Check console for request logs. Configure `.env` with real credentials for production.

### Payment Modal Not Closing
Check browser console for errors. Ensure backend payment endpoint is accessible.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `cd frontend && npm run build`
2. Deploy `frontend/build` folder
3. Set environment variable: `REACT_APP_API_URL=your-backend-url`

### Backend (Render/Railway/Heroku)
1. Deploy root folder
2. Set start command: `node backend/server.js`
3. Add environment variables from `.env.example`

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Future Enhancements

- [ ] User authentication system
- [ ] Real-time chat between drivers/riders
- [ ] Campus Marketplace for peer-to-peer selling
- [ ] Ashway Chatbot assistant
- [ ] Anonymous confessions wall
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Database migration (MongoDB/PostgreSQL)
- [ ] Admin dashboard
- [ ] Analytics and insights

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Email: info@theashway.com

## 🎉 Acknowledgments

- Ashesi University community
- All local service providers around Berekuso
- Ghana's vibrant tech community

---

**Made with ❤️ for the Ashesi community**

*"Small tip go carry you far!"* 😄

