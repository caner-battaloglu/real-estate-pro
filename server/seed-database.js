// Database seeding script to populate the backend with mock data
const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { Property } = require('./src/models/Property');

// Mock data
const mockUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    mustChangePassword: false,
    createdByAdmin: false,
  },
  {
    email: 'sarah.johnson@realestate.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'agent',
    phone: '+1 (555) 123-4567',
    bio: 'With over 10 years of experience in luxury real estate, Sarah specializes in downtown properties and has helped over 200 families find their dream homes.',
    specialties: ['Luxury Apartments', 'Downtown Properties', 'Investment Properties'],
    experience: 10,
    rating: 4.9,
    propertiesSold: 247,
    isActive: true,
    mustChangePassword: false,
    createdByAdmin: false,
  },
  {
    email: 'michael.chen@realestate.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'agent',
    phone: '+1 (555) 234-5678',
    bio: 'Michael is a top-performing agent specializing in suburban family homes. His attention to detail and market knowledge make him a trusted advisor.',
    specialties: ['Family Homes', 'Suburban Properties', 'First-time Buyers'],
    experience: 8,
    rating: 4.8,
    propertiesSold: 189,
    isActive: true,
    mustChangePassword: false,
    createdByAdmin: false,
  },
  {
    email: 'emily.rodriguez@realestate.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'agent',
    phone: '+1 (555) 345-6789',
    bio: 'Emily brings energy and expertise to every transaction. She\'s known for her excellent communication skills and ability to negotiate the best deals.',
    specialties: ['Condos', 'Beach Properties', 'Young Professionals'],
    experience: 6,
    rating: 4.7,
    propertiesSold: 156,
    isActive: false,
    mustChangePassword: false,
    createdByAdmin: false,
  },
  {
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
    mustChangePassword: false,
    createdByAdmin: false,
  }
];

const mockProperties = [
  {
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
    price: 450000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop'
    ],
    address: {
      line1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    status: 'approved',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    title: 'Luxury Family House',
    description: 'Spacious family home with large backyard and modern amenities.',
    price: 750000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'
    ],
    address: {
      line1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90210',
      country: 'USA'
    },
    status: 'approved',
    approvedAt: new Date('2024-01-16T14:20:00Z'),
    createdAt: new Date('2024-01-10T09:15:00Z'),
    updatedAt: new Date('2024-01-16T14:20:00Z')
  },
  {
    title: 'Contemporary Condo',
    description: 'Stylish condo with modern finishes and city views.',
    price: 320000,
    type: 'condo',
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop'
    ],
    address: {
      line1: '789 Beach Road',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    status: 'rejected',
    rejectionReason: 'Incomplete property information and missing required documents.',
    createdAt: new Date('2024-01-05T16:45:00Z'),
    updatedAt: new Date('2024-01-12T11:30:00Z')
  },
  {
    title: 'Cozy Suburban Home',
    description: 'Perfect starter home in a quiet neighborhood with excellent schools nearby.',
    price: 280000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=300&fit=crop'
    ],
    address: {
      line1: '321 Elm Street',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'USA'
    },
    status: 'approved',
    createdAt: new Date('2024-01-20T08:15:00Z'),
    updatedAt: new Date('2024-01-20T08:15:00Z')
  },
  {
    title: 'Penthouse with City Views',
    description: 'Luxurious penthouse with panoramic city views and premium amenities.',
    price: 1200000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop'
    ],
    address: {
      line1: '1000 Sky Tower',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    status: 'draft',
    createdAt: new Date('2024-01-25T12:00:00Z'),
    updatedAt: new Date('2024-01-25T12:00:00Z')
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-pro');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of mockUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    // Create properties and assign agents
    console.log('Creating properties...');
    const agents = createdUsers.filter(user => user.role === 'agent');
    const admin = createdUsers.find(user => user.role === 'admin');

    for (let i = 0; i < mockProperties.length; i++) {
      const propertyData = mockProperties[i];
      const agent = agents[i % agents.length]; // Cycle through agents
      
      const property = await Property.create({
        ...propertyData,
        agent: agent._id,
        approvedBy: propertyData.status === 'approved' ? admin._id : undefined,
      });

      console.log(`Created property: ${property.title} (${property.status}) - Agent: ${agent.firstName} ${agent.lastName}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nCreated:');
    console.log(`- ${createdUsers.length} users (${createdUsers.filter(u => u.role === 'admin').length} admin, ${createdUsers.filter(u => u.role === 'agent').length} agents, ${createdUsers.filter(u => u.role === 'user').length} users)`);
    console.log(`- ${mockProperties.length} properties`);
    
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Agent: sarah.johnson@realestate.com / password123');
    console.log('User: user@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
