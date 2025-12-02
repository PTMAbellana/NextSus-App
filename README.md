# NextSus - Campus Management Application

A full-stack campus management application with room booking, parking management, and sustainability tracking features.

## Features

### 🎓 For Students & Faculty
- **User Authentication**: Secure login and registration system
- **Room Booking**: Book study rooms, classrooms, and meeting spaces
- **Interactive Maps**: Visual representation of available spaces
- **Schedule Management**: View and manage your bookings
- **Parking Status**: Real-time parking availability
- **Sustainability Tracking**: Monitor your carbon footprint reduction
- **Profile Management**: Personal dashboard with stats

### 🔧 Technical Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication
- React with React Router for SPA navigation
- Responsive mobile-first design
- Real-time availability checking
- Booking conflict prevention

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone or navigate to the project directory
```powershell
cd "C:\Users\Acer Aspire 7\Desktop\NextSus-App"
```

### 2. Install dependencies for all parts of the application
```powershell
npm run install-all
```

Or install manually:
```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service:
  ```powershell
  # Start MongoDB (if installed as a service)
  net start MongoDB
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update the `MONGODB_URI` in `backend/.env`

### 4. Configure Environment Variables

The `.env` file in the backend folder is already created. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nextsus
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a secure random string in production!

### 5. Seed the Database (Optional)

To add sample data, run the seed script:
```powershell
cd backend
node seed.js
```

### 6. Start the Application

**Option A: Start everything at once (Recommended)**
```powershell
npm start
```

**Option B: Start separately**

Terminal 1 (Backend):
```powershell
cd backend
npm start
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm start
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
NextSus-App/
├── backend/
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── Parking.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   ├── bookings.js
│   │   ├── parking.js
│   │   └── users.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── server.js         # Express server
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── BottomNav.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/      # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/        # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js
│   │   │   ├── Booking.js
│   │   │   ├── Schedule.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
└── package.json          # Root package file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room (Admin)
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/room/:roomId` - Get room bookings

### Parking
- `GET /api/parking` - Get all parking spots
- `GET /api/parking/stats` - Get parking statistics
- `POST /api/parking/:id/occupy` - Occupy parking spot
- `POST /api/parking/:id/release` - Release parking spot

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user
- `POST /api/users/carbon` - Update carbon saved

## Default Test Credentials

After seeding the database:

**Student Account**
- Email: john.doe@university.edu
- Password: password123

**Admin Account**
- Email: admin@university.edu
- Password: admin123

## Development

### Run in development mode
```powershell
npm run dev
```

This will start both backend and frontend with auto-reload enabled.

### Backend Development
```powershell
cd backend
npm run dev
```

Uses `nodemon` for auto-restart on file changes.

### Frontend Development
```powershell
cd frontend
npm start
```

React development server with hot-reload.

## Building for Production

### Build Frontend
```powershell
cd frontend
npm run build
```

Creates optimized production build in `frontend/build/`

### Deploy Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Change `JWT_SECRET` to a secure value
4. Deploy to your preferred hosting platform (Heroku, AWS, DigitalOcean, etc.)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- For MongoDB Atlas, check network access and credentials

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): Set `PORT=3001` before running `npm start`

### CORS Errors
- Ensure backend is running
- Check the `proxy` setting in `frontend/package.json`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Verify token is being sent in requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## Future Enhancements

- [ ] Real-time notifications
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] QR code check-ins
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Social features
- [ ] AI-powered room recommendations
- [ ] IoT integration for real-time occupancy

---

**NextSus** - Navigate, Connect, Sustain 🌱
