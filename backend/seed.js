const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Room = require('./models/Room');
const Parking = require('./models/Parking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nextsus')
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Parking.deleteMany({});
    
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@university.edu',
        password: hashedPassword,
        studentId: 'S12345678',
        role: 'student',
        gpa: 3.85,
        carbonSaved: 12.5
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@university.edu',
        password: hashedPassword,
        studentId: 'S87654321',
        role: 'student',
        gpa: 3.92,
        carbonSaved: 18.3
      },
      {
        name: 'Admin User',
        email: 'admin@university.edu',
        password: adminPassword,
        studentId: 'A00000001',
        role: 'admin',
        gpa: 4.0,
        carbonSaved: 50.0
      }
    ]);

    console.log('✅ Created sample users');

    // Create sample rooms
    const rooms = await Room.insertMany([
      {
        name: 'CE-301',
        building: 'Building A',
        floor: 3,
        capacity: 30,
        type: 'classroom',
        amenities: ['Projector', 'Whiteboard', 'Air Conditioning'],
        status: 'available',
        coordinates: { x: 30, y: 30 }
      },
      {
        name: 'CE-302',
        building: 'Building A',
        floor: 3,
        capacity: 25,
        type: 'classroom',
        amenities: ['Projector', 'Whiteboard'],
        status: 'available',
        coordinates: { x: 70, y: 30 }
      },
      {
        name: 'CE-303',
        building: 'Building A',
        floor: 3,
        capacity: 40,
        type: 'classroom',
        amenities: ['Projector', 'Smart Board', 'Air Conditioning'],
        status: 'occupied',
        coordinates: { x: 110, y: 30 }
      },
      {
        name: 'CE-401',
        building: 'Building A',
        floor: 4,
        capacity: 35,
        type: 'classroom',
        amenities: ['Projector', 'Whiteboard', 'Air Conditioning'],
        status: 'available',
        coordinates: { x: 30, y: 65 }
      },
      {
        name: 'Study Niche 1',
        building: 'Building A',
        floor: 2,
        capacity: 8,
        type: 'study-niche',
        amenities: ['Whiteboard', 'Power Outlets'],
        status: 'available',
        coordinates: { x: 150, y: 30 }
      },
      {
        name: 'Study Niche 2',
        building: 'Building A',
        floor: 2,
        capacity: 6,
        type: 'study-niche',
        amenities: ['Whiteboard', 'Power Outlets'],
        status: 'reserved',
        coordinates: { x: 190, y: 30 }
      },
      {
        name: 'Lab 1',
        building: 'Building B',
        floor: 1,
        capacity: 20,
        type: 'lab',
        amenities: ['Computers', 'Projector', 'Air Conditioning'],
        status: 'available',
        coordinates: { x: 70, y: 65 }
      },
      {
        name: 'Meeting Room A',
        building: 'Building C',
        floor: 2,
        capacity: 12,
        type: 'meeting-room',
        amenities: ['Conference Table', 'Projector', 'Video Conference'],
        status: 'available',
        coordinates: { x: 110, y: 65 }
      }
    ]);

    console.log('✅ Created sample rooms');

    // Create sample parking spots
    const parkingSpots = [];
    const zones = ['Zone A', 'Zone B', 'Zone C'];
    const types = ['car', 'car', 'car', 'motorcycle', 'bicycle'];
    
    for (let i = 1; i <= 30; i++) {
      parkingSpots.push({
        spotNumber: `P${i.toString().padStart(3, '0')}`,
        zone: zones[Math.floor((i - 1) / 10)],
        type: types[Math.floor(Math.random() * types.length)],
        status: Math.random() > 0.5 ? 'available' : 'occupied',
        coordinates: { 
          x: 200 + (i % 10) * 10, 
          y: 40 + Math.floor(i / 10) * 20 
        }
      });
    }

    // Add some EV charging spots
    parkingSpots.push(
      {
        spotNumber: 'EV01',
        zone: 'Zone A',
        type: 'ev-charging',
        status: 'available',
        coordinates: { x: 230, y: 70 }
      },
      {
        spotNumber: 'EV02',
        zone: 'Zone A',
        type: 'ev-charging',
        status: 'occupied',
        coordinates: { x: 240, y: 70 }
      }
    );

    await Parking.insertMany(parkingSpots);

    console.log('✅ Created sample parking spots');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Student: john.doe@university.edu / password123');
    console.log('Admin: admin@university.edu / admin123');
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
