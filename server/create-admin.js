// Simple script to create an admin user for testing
const mongoose = require('mongoose');
const { User } = require('./src/models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-pro');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      mustChangePassword: false,
      createdByAdmin: false,
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();