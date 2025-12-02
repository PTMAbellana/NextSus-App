# NextSus App Deployment Guide

## Quick Start Options

### Option 1: Vercel + Render (Recommended - FREE)

#### Backend (Render.com)
1. Push code to GitHub
2. Sign up at [Render.com](https://render.com)
3. New Web Service → Connect GitHub repo
4. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables:
     - `MONGODB_URI` (MongoDB Atlas connection string)
     - `JWT_SECRET` (random secure string)
     - `NODE_ENV=production`

#### Frontend (Vercel.com)
1. Sign up at [Vercel.com](https://vercel.com)
2. Import GitHub repo
3. Configure:
   - Root Directory: `frontend`
   - Framework: Create React App
   - Add environment variable:
     - `REACT_APP_API_URL=https://your-backend-url.onrender.com`
4. Deploy

### Option 2: VPS (DigitalOcean, AWS, Linode)

```bash
# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mongodb nginx

# Clone and setup
git clone <your-repo>
cd NextSus-App
npm run install-all

# Setup environment
cd backend
cp .env.example .env
# Edit .env with your values

# Install PM2
sudo npm install -g pm2

# Start backend
pm2 start server.js --name nextsus-backend
pm2 save
pm2 startup

# Build frontend
cd ../frontend
npm run build

# Configure Nginx (see nginx.conf example)
```

### Option 3: Docker

```bash
docker-compose up -d
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (production/development)

### Frontend (.env.production)
- `REACT_APP_API_URL` - Backend API URL

## Database Setup

### MongoDB Atlas (Cloud - FREE)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0
5. Get connection string
6. Update backend .env

### Local MongoDB
```bash
# Install MongoDB
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Seed Database

```bash
cd backend
npm run seed
```

## SSL Certificate (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

```bash
# View backend logs
pm2 logs nextsus-backend

# Monitor processes
pm2 monit

# Restart backend
pm2 restart nextsus-backend
```

## Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify environment variables
- Check logs: `pm2 logs`

### Frontend can't connect to backend
- Verify proxy in package.json (development)
- Verify REACT_APP_API_URL (production)
- Check CORS settings in backend

### Database connection failed
- Verify MongoDB is running
- Check connection string
- Whitelist IP in MongoDB Atlas

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use environment variables (never commit .env)
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use strong database passwords
- [ ] Keep dependencies updated
- [ ] Enable rate limiting
- [ ] Use helmet.js for security headers

## Support

For issues, check:
- Backend logs: `pm2 logs nextsus-backend`
- Frontend console: Browser DevTools
- MongoDB logs: `sudo journalctl -u mongodb`
