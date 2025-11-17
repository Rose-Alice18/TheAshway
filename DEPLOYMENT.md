# 🚀 Deployment Guide - The Ashway

Complete guide to deploying The Ashway to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Configure environment variables
- [ ] Set up email service
- [ ] Choose hosting platforms
- [ ] Set up database (optional - upgrade from JSON)
- [ ] Configure payment gateway (Paystack/MoMo)
- [ ] Test on multiple devices/browsers
- [ ] Optimize images and assets
- [ ] Set up monitoring/analytics

---

## 🌐 Deployment Options

### Option 1: Separate Hosting (Recommended)

**Frontend**: Vercel/Netlify (free tier)
**Backend**: Render/Railway/Heroku (free tier)

**Pros:**
- Separate scaling
- Free tiers available
- Easy CI/CD
- Fast deployments

**Cons:**
- Need to manage CORS
- Two separate URLs (until custom domain)

### Option 2: Unified Hosting

**Both**: DigitalOcean/AWS/Google Cloud

**Pros:**
- Single server
- More control
- No CORS issues

**Cons:**
- More expensive
- Manual setup required
- Need to configure reverse proxy

---

## 🎯 Frontend Deployment

### Vercel (Recommended)

1. **Build the app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configure environment variables** in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

5. **Set build settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install`

### Netlify Alternative

1. **Connect GitHub repo** in Netlify dashboard

2. **Set build settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

3. **Add environment variable**:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy!** (automatic on git push)

---

## 🖥️ Backend Deployment

### Render (Recommended - Free Tier)

1. **Create account** at [render.com](https://render.com)

2. **New Web Service** → Connect GitHub repo

3. **Configure**:
   ```
   Name: theashway-api
   Environment: Node
   Build Command: npm install
   Start Command: node backend/server.js
   ```

4. **Add environment variables**:
   ```
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   DEVELOPER_EMAIL=dev@theashway.com
   NODE_ENV=production
   ```

5. **Deploy** (automatic)

6. **Get URL**: `https://theashway-api.onrender.com`

### Railway Alternative

1. **Create account** at [railway.app](https://railway.app)

2. **New Project** → Deploy from GitHub

3. **Add variables** in dashboard:
   ```
   PORT=5000
   EMAIL_USER=...
   EMAIL_PASS=...
   ```

4. **Railway auto-detects** Node.js and deploys

5. **Custom domain** available on paid plans

### Heroku Alternative

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create theashway-api
   ```

3. **Set environment variables**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-password
   ```

4. **Create Procfile**:
   ```
   web: node backend/server.js
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🗄️ Database Setup (Optional)

### Upgrade from JSON to MongoDB

1. **Create MongoDB Atlas account** (free)

2. **Install mongoose**
   ```bash
   npm install mongoose
   ```

3. **Create models** (`backend/models/`)
   ```javascript
   // backend/models/Driver.js
   const mongoose = require('mongoose');

   const driverSchema = new mongoose.Schema({
     name: String,
     carType: String,
     location: String,
     availability: String,
     contact: String,
     rating: Number,
   });

   module.exports = mongoose.model('Driver', driverSchema);
   ```

4. **Update routes** to use Mongoose instead of JSON files

5. **Connect to database**
   ```javascript
   // backend/server.js
   mongoose.connect(process.env.MONGODB_URI);
   ```

6. **Seed initial data**
   ```bash
   node backend/seed.js
   ```

---

## 📧 Email Configuration

### Gmail Setup

1. **Enable 2-Step Verification** in Google Account

2. **Generate App Password**:
   - Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy 16-digit password

3. **Update `.env`**:
   ```
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   DEVELOPER_EMAIL=where-to-receive@email.com
   ```

4. **Test locally** before deploying

### Alternative: SendGrid/Mailgun

For production, consider dedicated email services:

```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

---

## 💳 Payment Integration

### Paystack Setup

1. **Create account** at [paystack.com](https://paystack.com)

2. **Get API keys** from dashboard

3. **Install Paystack**
   ```bash
   npm install paystack
   ```

4. **Update payment route**
   ```javascript
   // backend/routes/payments.js
   const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

   router.post('/tip', async (req, res) => {
     const { email, amount } = req.body;

     const response = await paystack.transaction.initialize({
       email,
       amount: amount * 100, // Convert to pesewas
       callback_url: 'https://yoursite.com/verify',
     });

     res.json(response);
   });
   ```

5. **Frontend integration**
   ```javascript
   // Use Paystack popup
   const payWithPaystack = () => {
     const handler = PaystackPop.setup({
       key: 'pk_test_xxx',
       email: 'user@email.com',
       amount: 200, // GHS 2 in pesewas
       onClose: () => alert('Payment cancelled'),
       callback: (response) => {
         // Verify on backend
       }
     });
     handler.openIframe();
   };
   ```

### Mobile Money (MTN/Vodafone)

Contact providers for API access:
- MTN MoMo API: [momodeveloper.mtn.com](https://momodeveloper.mtn.com)
- Vodafone Cash: Contact Vodafone business

---

## 🔒 Security Hardening

### 1. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Helmet (Security Headers)
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. Input Validation
```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

router.post('/delivery/request', [
  body('name').trim().isLength({ min: 2 }),
  body('contact').matches(/^0\d{9}$/),
  body('itemDescription').trim().isLength({ min: 10 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### 4. HTTPS Only
```javascript
// backend/server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/node
```

```javascript
// backend/server.js
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.errorHandler());
```

### 2. Google Analytics (Frontend)
```javascript
// frontend/src/index.js
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send('pageview');
```

### 3. Uptime Monitoring
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Monitor both frontend and backend
- Get alerts on downtime

---

## 🌍 Custom Domain

### 1. Buy Domain
- Namecheap, GoDaddy, Google Domains
- Suggested: `theashway.com`, `ashway.gh`

### 2. Configure DNS

**For Vercel (Frontend):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Render (Backend):**
```
Type: CNAME
Name: api
Value: your-app.onrender.com
```

**Result:**
- Frontend: `https://theashway.com`
- Backend: `https://api.theashway.com`

### 3. SSL Certificate
- Vercel/Render auto-provision Let's Encrypt SSL
- Ensure "Force HTTPS" is enabled

---

## 🚀 Deployment Commands

### Full Production Build

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Test production build locally
npx serve -s build

# 3. Deploy frontend
vercel --prod

# 4. Deploy backend (if using Render/Railway)
git push origin main  # Auto-deploys

# 5. Verify deployment
curl https://api.theashway.com
curl https://theashway.com
```

---

## 🧪 Post-Deployment Testing

### Checklist

- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] Payment flow works
- [ ] Email notifications send
- [ ] Mobile responsive
- [ ] Forms validate
- [ ] Error pages work (404, 500)
- [ ] HTTPS enforced
- [ ] Fast load times (<3s)
- [ ] SEO meta tags present

### Tools
- **Lighthouse**: Test performance
- **GTmetrix**: Speed analysis
- **Pingdom**: Uptime monitoring
- **BrowserStack**: Cross-browser testing

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install

      - name: Run tests
        run: npm test

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 💡 Optimization Tips

### 1. Frontend
- Enable React production build
- Compress images (use WebP)
- Enable gzip compression
- Lazy load images
- Code splitting

### 2. Backend
- Enable response compression
- Cache API responses
- Use CDN for static assets
- Optimize database queries

### 3. Performance
```javascript
// backend/server.js
const compression = require('compression');
app.use(compression());
```

---

## 📱 PWA (Progressive Web App)

### Make it installable

1. **Update manifest.json**:
   ```json
   {
     "short_name": "Ashway",
     "name": "The Ashway - Community Hub",
     "icons": [
       {
         "src": "icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ],
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#006B3F",
     "background_color": "#ffffff"
   }
   ```

2. **Add service worker** (auto-generated by Create React App)

3. **Test**: Chrome DevTools → Application → Manifest

---

## 🎯 Go Live Checklist

Before announcing:

- [ ] All features tested in production
- [ ] Payment gateway live (if applicable)
- [ ] Email notifications working
- [ ] Error tracking configured
- [ ] Analytics installed
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Privacy policy page (if collecting data)
- [ ] Contact page/info
- [ ] Social media links
- [ ] Mobile app badges (future)

---

## 🆘 Troubleshooting

### Common Issues

**Frontend can't reach backend**
```
Solution: Update REACT_APP_API_URL in Vercel
```

**Emails not sending**
```
Solution: Check EMAIL_USER and EMAIL_PASS in backend env vars
```

**CORS errors**
```
Solution: Add frontend URL to CORS whitelist in backend
```

**Build fails**
```
Solution: Check Node version compatibility, run npm ci
```

---

## 📞 Support After Deployment

- **Monitor logs**: Check Render/Vercel logs daily
- **Set up alerts**: Email/Slack for errors
- **User feedback**: Add feedback form
- **Regular updates**: Keep dependencies updated

---

**Your app is ready for the world! 🌍🚀**

*"E don set! Make we launch!"* 🎉

