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
    title: 'City Center Studio Apartment',
    description:
      'Compact, well-planned studio in the city center, ideal for young professionals or students. Open-plan living with a small kitchenette and modern bathroom.',
    price: 145000,
    type: 'apartment',
    bedrooms: 0, // studio
    bathrooms: 1,
    area: 420,
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '12 Market Lane',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      country: 'USA'
    },
    status: 'approved',
    createdAt: new Date('2024-01-08T09:10:00Z'),
    updatedAt: new Date('2024-01-08T09:10:00Z')
  },
  {
    title: 'Bright 1-Bedroom Apartment',
    description:
      'South-facing 1-bedroom apartment with a separate bedroom, open living area, and balcony overlooking a quiet courtyard.',
    price: 225000,
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    images: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519710884008-592965723cbc?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '45 Green Street',
      city: 'Boston',
      state: 'MA',
      postalCode: '02116',
      country: 'USA'
    },
    status: 'approved',
    createdAt: new Date('2024-01-05T11:45:00Z'),
    updatedAt: new Date('2024-01-12T15:30:00Z')
  },
  {
    title: 'Modern Downtown Apartment',
    description:
      'Updated 2-bedroom apartment in the heart of downtown with open-plan kitchen, in-unit laundry, and skyline views.',
    price: 365000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 980,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&h=600&fit=crop'
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
    title: 'Cozy Suburban Home',
    description:
      'Single-story family home with three bedrooms, updated kitchen, and a fenced backyard perfect for kids and pets.',
    price: 315000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 1650,
    images: [
      'https://images.unsplash.com/photo-1570129476766-47cbb58fc0c6?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1599423300746-b62533397364?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&h=600&fit=crop'
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
    title: 'Family House with Garden',
    description:
      'Detached 4-bedroom house in a quiet residential street with private garden, garage, and spacious living room.',
    price: 465000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2300,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a534c36c8?w=900&h=600&fit=crop'
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
    title: 'Contemporary Beachside Condo',
    description:
      '1-bedroom condo a short walk from the beach, featuring a bright living area, balcony, and shared pool access.',
    price: 289000,
    type: 'condo',
    bedrooms: 1,
    bathrooms: 1,
    area: 780,
    images: [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '789 Beach Road',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    status: 'approved',
    createdAt: new Date('2024-01-05T16:45:00Z'),
    updatedAt: new Date('2024-01-12T11:30:00Z')
  },
  {
    title: 'Top-Floor Penthouse with Terrace',
    description:
      'Spacious 3-bedroom penthouse with private rooftop terrace, floor-to-ceiling windows, and underground parking.',
    price: 725000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 1900,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '1000 Sky Tower',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA'
    },
    status: 'pending',
    createdAt: new Date('2024-01-25T12:00:00Z'),
    updatedAt: new Date('2024-01-25T12:00:00Z')
  },
  {
    title: 'Downtown Office Floor',
    description:
      'Class B office space on a mid-level floor with open-plan work area, 2 meeting rooms, and kitchenette.',
    price: 495000,
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 3100,
    images: [
      'https://images.unsplash.com/photo-1529429617124-aee711a2b56c?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '200 Market Street',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60602',
      country: 'USA'
    },
    status: 'approved',
    createdAt: new Date('2024-01-18T11:00:00Z'),
    updatedAt: new Date('2024-01-22T09:45:00Z')
  },
  {
    title: 'Riverside Flat near Tower Bridge',
    description:
      'Elegant 2-bedroom flat overlooking the Thames with floor-to-ceiling windows, bespoke kitchen, and concierge services.',
    price: 550000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    images: [
      'https://images.unsplash.com/photo-1469474719161-8977f997c5ab?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469474175568-0c2f710b74e0?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '25 Queen\'s Walk',
      city: 'London',
      state: 'London',
      postalCode: 'SE1 2JX',
      country: 'UK'
    },
    status: 'approved',
    createdAt: new Date('2024-02-02T10:00:00Z'),
    updatedAt: new Date('2024-02-05T14:00:00Z')
  },
  {
    title: 'Georgian Townhouse in Notting Hill',
    description:
      'Four-story Georgian townhouse featuring original fireplaces, private garden, and a self-contained studio on the lower ground floor.',
    price: 1850000,
    type: 'house',
    bedrooms: 5,
    bathrooms: 4,
    area: 310,
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '14 Westbourne Grove',
      city: 'London',
      state: 'London',
      postalCode: 'W2 5RH',
      country: 'UK'
    },
    status: 'approved',
    approvedAt: new Date('2024-02-10T12:30:00Z'),
    createdAt: new Date('2024-02-03T09:20:00Z'),
    updatedAt: new Date('2024-02-10T12:30:00Z')
  },
  {
    title: 'Canalside Loft in Birmingham',
    description:
      'Converted warehouse loft with double-height ceilings, exposed brickwork, and balcony overlooking the canal basin.',
    price: 375000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '8 Wharfside Close',
      city: 'Birmingham',
      state: 'West Midlands',
      postalCode: 'B1 1RD',
      country: 'UK'
    },
    status: 'pending',
    createdAt: new Date('2024-02-12T11:00:00Z'),
    updatedAt: new Date('2024-02-12T11:00:00Z')
  },
  {
    title: 'Penthouse with Views of the Shard',
    description:
      'Boutique penthouse perched above Borough Market offering wraparound terrace, private lift access, and secure underground parking.',
    price: 2200000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 185,
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=600&fit=crop',
      'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=900&h=600&fit=crop'
    ],
    address: {
      line1: '1 Borough High Street',
      city: 'London',
      state: 'London',
      postalCode: 'SE1 9RG',
      country: 'UK'
    },
    status: 'approved',
    createdAt: new Date('2024-02-08T15:45:00Z'),
    updatedAt: new Date('2024-02-11T09:10:00Z')
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
