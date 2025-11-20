import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User, IUser } from "../models/User";
import { Property, IProperty } from "../models/Property";
import { Booking } from "../models/Booking";
import { Notification } from "../models/Notification";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/real_estate_pro";

// Category-specific image sets from Pexels
const getImagesByType = (type: string): string[] => {
  const imageSets: Record<string, string[]> = {
    Apartment: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    Condo: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    House: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    Villa: [
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    Townhouse: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    Studio: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    Commercial: [
      "https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ]
  };
  return imageSets[type] || imageSets.House; // Default to house images
};

type SeedProperty = {
  title: string;
  description: string;
  price: number;
  type: IProperty["type"];
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  address: IProperty["address"];
  location: string;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
};

const propertySeedData: SeedProperty[] = [
  {
    title: "Modern Downtown Apartment",
    description:
      "Beautiful modern apartment in the heart of downtown Istanbul with skyline views, concierge service, and curated interiors.",
    price: 545000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 118,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "123 Istiklal Avenue",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34000"
    },
    location: "Istanbul, Turkey",
    status: "approved"
  },
  {
    title: "Bosphorus View Condo",
    description:
      "Sophisticated three-bedroom condo overlooking the Bosphorus with wraparound balcony, smart-home controls, and secure parking.",
    price: 642000,
    type: "Condo",
    bedrooms: 3,
    bathrooms: 2,
    area: 156,
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "88 Bosphorus Boulevard",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34470"
    },
    location: "Istanbul, Turkey",
    status: "approved"
  },
  {
    title: "Ankara Family Residence",
    description:
      "Warm family home in Çankaya featuring a private garden, home office, and quick access to international schools.",
    price: 489000,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 210,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "45 Ataturk Street",
      city: "Ankara",
      country: "Turkey",
      postalCode: "06680"
    },
    location: "Ankara, Turkey",
    status: "approved"
  },
  {
    title: "Izmir Seaside Villa",
    description:
      "Resort-style villa steps from the Aegean Sea, boasting an infinity pool, guest house, and outdoor kitchen.",
    price: 1245000,
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    images: [
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396134/pexels-photo-1396134.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "12 Marina Road",
      city: "Izmir",
      country: "Turkey",
      postalCode: "35350"
    },
    location: "Izmir, Turkey",
    status: "approved"
  },
  {
    title: "Antalya Resort Apartment",
    description:
      "Fully furnished apartment inside a managed resort with beach shuttle, wellness spa, and co-working lounge.",
    price: 368000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 104,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "50 Resort Way",
      city: "Antalya",
      country: "Turkey",
      postalCode: "07100"
    },
    location: "Antalya, Turkey",
    status: "approved"
  },
  {
    title: "Bursa Historic Townhouse",
    description:
      "Beautifully restored townhouse with exposed beams, sunroom, and courtyard nestled in Bursa’s historic district.",
    price: 412000,
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 168,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "19 Silk Market Lane",
      city: "Bursa",
      country: "Turkey",
      postalCode: "16010"
    },
    location: "Bursa, Turkey",
    status: "approved"
  },
  {
    title: "Cappadocia Cave Retreat",
    description:
      "Boutique cave home carved into the hillside featuring vaulted ceilings, wine cellar, and panoramic terrace.",
    price: 295000,
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    area: 142,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "7 Fairy Chimney Road",
      city: "Nevsehir",
      country: "Turkey",
      postalCode: "50240"
    },
    location: "Nevsehir, Turkey",
    status: "approved"
  },
  {
    title: "Executive Business Suite",
    description:
      "Turn-key commercial suite with glass-front meeting rooms, dedicated reception, and fiber internet.",
    price: 1125000,
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 302,
    images: [
      "https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "200 Market Street",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34340"
    },
    location: "Istanbul, Turkey",
    status: "approved"
  },
  {
    title: "Bodrum Marina Loft",
    description:
      "Loft-style residence steps from Bodrum marina with double-height living spaces, chef's kitchen, and mooring access.",
    price: 785000,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 192,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "4 Marina Promenade",
      city: "Bodrum",
      country: "Turkey",
      postalCode: "48400"
    },
    location: "Bodrum, Turkey",
    status: "approved"
  },
  {
    title: "Sapanca Lake Cottage",
    description:
      "Cozy cottage with lake views, wood-burning fireplace, and private sauna, perfect for weekend getaways.",
    price: 335000,
    type: "House",
    bedrooms: 2,
    bathrooms: 2,
    area: 126,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "27 Lakeside Drive",
      city: "Sakarya",
      country: "Turkey",
      postalCode: "54600"
    },
    location: "Sapanca, Turkey",
    status: "pending"
  },
  {
    title: "Historic Galata Flat",
    description:
      "Renovated flat in a 19th-century building with original hardwood floors, Juliet balconies, and city skyline views.",
    price: 498000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    area: 132,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "67 Galata Tower Street",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34430"
    },
    location: "Istanbul, Turkey",
    status: "pending"
  },
  {
    title: "Uludağ Ski Chalet",
    description:
      "Slope-side chalet with four suites, hot tub, gear room, and private chef’s kitchen ideal for winter retreats.",
    price: 715000,
    type: "House",
    bedrooms: 4,
    bathrooms: 4,
    area: 238,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "9 Alpine Trail",
      city: "Bursa",
      country: "Turkey",
      postalCode: "16080"
    },
    location: "Uludağ, Turkey",
    status: "approved"
  },
  {
    title: "Izmir Urban Loft",
    description:
      "Industrial-style loft in Alsancak with exposed brick, mezzanine bedroom, and artisan coffee shop downstairs.",
    price: 285000,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 98,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "33 Republic Avenue",
      city: "Izmir",
      country: "Turkey",
      postalCode: "35220"
    },
    location: "Izmir, Turkey",
    status: "rejected",
    rejectionReason: "Awaiting updated floor plans"
  },
  {
    title: "Fethiye Coastal Bungalow",
    description:
      "Relaxed coastal bungalow surrounded by olive trees, minutes from turquoise beaches and seaside cafes.",
    price: 365000,
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    area: 134,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    address: {
      line1: "14 Olive Grove Road",
      city: "Mugla",
      country: "Turkey",
      postalCode: "48300"
    },
    location: "Fethiye, Turkey",
    status: "rejected",
    rejectionReason: "Incomplete documentation"
  },
  // USA Properties
  {
    title: "Modern Manhattan Apartment",
    description:
      "Luxury apartment in the heart of Manhattan with stunning city views, premium finishes, and access to world-class amenities.",
    price: 1250000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 110, // m² - will be converted to sq ft for USA
    images: getImagesByType("Apartment"),
    address: {
      line1: "123 Park Avenue",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001"
    },
    location: "New York, NY, USA",
    status: "approved"
  },
  {
    title: "Beverly Hills Luxury Condo",
    description:
      "Sophisticated three-bedroom condo with panoramic city views, smart-home controls, and secure parking.",
    price: 2850000,
    type: "Condo",
    bedrooms: 3,
    bathrooms: 2,
    area: 145, // m²
    images: getImagesByType("Condo"),
    address: {
      line1: "456 Rodeo Drive",
      city: "Beverly Hills",
      state: "CA",
      country: "USA",
      postalCode: "90210"
    },
    location: "Beverly Hills, CA, USA",
    status: "approved"
  },
  {
    title: "Suburban Family Home",
    description:
      "Spacious family home featuring a private garden, home office, and quick access to top-rated schools.",
    price: 750000,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 195, // m²
    images: getImagesByType("House"),
    address: {
      line1: "789 Oak Street",
      city: "Austin",
      state: "TX",
      country: "USA",
      postalCode: "78701"
    },
    location: "Austin, TX, USA",
    status: "approved"
  },
  {
    title: "Miami Beachfront Villa",
    description:
      "Resort-style villa steps from the ocean, boasting an infinity pool, guest house, and outdoor kitchen.",
    price: 4500000,
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 298, // m²
    images: getImagesByType("Villa"),
    address: {
      line1: "12 Ocean Drive",
      city: "Miami Beach",
      state: "FL",
      country: "USA",
      postalCode: "33139"
    },
    location: "Miami Beach, FL, USA",
    status: "approved"
  },
  {
    title: "Seattle Downtown Apartment",
    description:
      "Fully furnished apartment with city views, concierge service, and access to co-working spaces.",
    price: 650000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 97, // m²
    images: getImagesByType("Apartment"),
    address: {
      line1: "50 Pike Street",
      city: "Seattle",
      state: "WA",
      country: "USA",
      postalCode: "98101"
    },
    location: "Seattle, WA, USA",
    status: "approved"
  },
  {
    title: "Historic Boston Townhouse",
    description:
      "Beautifully restored townhouse with original architectural details, sunroom, and private courtyard.",
    price: 1850000,
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 156, // m²
    images: getImagesByType("Townhouse"),
    address: {
      line1: "19 Beacon Hill",
      city: "Boston",
      state: "MA",
      country: "USA",
      postalCode: "02108"
    },
    location: "Boston, MA, USA",
    status: "approved"
  },
  {
    title: "Chicago Studio Loft",
    description:
      "Modern studio loft in the Loop with exposed brick, high ceilings, and walkability to everything.",
    price: 425000,
    type: "Studio",
    bedrooms: 0,
    bathrooms: 1,
    area: 65, // m²
    images: getImagesByType("Studio"),
    address: {
      line1: "33 Michigan Avenue",
      city: "Chicago",
      state: "IL",
      country: "USA",
      postalCode: "60601"
    },
    location: "Chicago, IL, USA",
    status: "approved"
  },
  {
    title: "Downtown Office Space",
    description:
      "Turn-key commercial office suite with glass-front meeting rooms, dedicated reception, and fiber internet.",
    price: 2500000,
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 280, // m²
    images: getImagesByType("Commercial"),
    address: {
      line1: "200 Market Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105"
    },
    location: "San Francisco, CA, USA",
    status: "approved"
  },
  {
    title: "Denver Mountain View Home",
    description:
      "Spacious home with mountain views, private deck, and quick access to hiking trails and ski resorts.",
    price: 895000,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 220, // m²
    images: getImagesByType("House"),
    address: {
      line1: "45 Mountain View Road",
      city: "Denver",
      state: "CO",
      country: "USA",
      postalCode: "80202"
    },
    location: "Denver, CO, USA",
    status: "approved"
  },
  {
    title: "Portland Modern Condo",
    description:
      "Contemporary condo in the Pearl District with floor-to-ceiling windows, rooftop terrace, and eco-friendly features.",
    price: 725000,
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 125, // m²
    images: getImagesByType("Condo"),
    address: {
      line1: "67 Pearl Street",
      city: "Portland",
      state: "OR",
      country: "USA",
      postalCode: "97209"
    },
    location: "Portland, OR, USA",
    status: "pending"
  },
  // UK Properties
  {
    title: "Riverside Flat near Tower Bridge",
    description:
      "Elegant two-bedroom flat with uninterrupted Thames views, bespoke kitchen finishes, and concierge services.",
    price: 550000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    images: getImagesByType("Apartment"),
    address: {
      line1: "25 Queen's Walk",
      city: "London",
      state: "England",
      country: "UK",
      postalCode: "SE1 2JX"
    },
    location: "London, UK",
    status: "approved"
  },
  {
    title: "Georgian Townhouse in Notting Hill",
    description:
      "Four-story Georgian townhouse featuring original fireplaces, private garden, and a self-contained studio.",
    price: 1850000,
    type: "House",
    bedrooms: 5,
    bathrooms: 4,
    area: 310,
    images: getImagesByType("House"),
    address: {
      line1: "14 Westbourne Grove",
      city: "London",
      state: "England",
      country: "UK",
      postalCode: "W2 5RH"
    },
    location: "London, UK",
    status: "approved"
  },
  {
    title: "Canalside Loft in Birmingham",
    description:
      "Converted warehouse loft with double-height ceilings, exposed brickwork, and balcony overlooking the canal basin.",
    price: 375000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: getImagesByType("Apartment"),
    address: {
      line1: "8 Wharfside Close",
      city: "Birmingham",
      state: "West Midlands",
      country: "UK",
      postalCode: "B1 1RD"
    },
    location: "Birmingham, UK",
    status: "pending"
  },
  {
    title: "Penthouse with Views of the Shard",
    description:
      "Boutique penthouse perched above Borough Market with wraparound terrace, private lift access, and secure parking.",
    price: 2200000,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 185,
    images: getImagesByType("Apartment"),
    address: {
      line1: "1 Borough High Street",
      city: "London",
      state: "England",
      country: "UK",
      postalCode: "SE1 9RG"
    },
    location: "London, UK",
    status: "approved"
  }
];

const agentSeedData: Array<Partial<IUser> & { email: string; password: string }> = [
  {
    email: "aylin.demir@realestate.com",
    password: "Agent123!",
    firstName: "Aylin",
    lastName: "Demir",
    phone: "+90 532 555 1212",
    role: "agent",
    isActive: true,
    createdByAdmin: true,
    mustChangePassword: false,
    bio: "Born and raised in Istanbul, Aylin curates waterfront residences along the Bosphorus and guides international families through the Turkish buying process.",
    specialties: ["Bosphorus View Homes", "Luxury Apartments", "International Buyers"],
    experience: 11,
    rating: 4.9,
    propertiesSold: 248,
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
    marketCountry: "Turkey"
  },
  {
    email: "kerem.yildiz@realestate.com",
    password: "Agent123!",
    firstName: "Kerem",
    lastName: "Yildiz",
    phone: "+90 533 410 8899",
    role: "agent",
    isActive: true,
    createdByAdmin: true,
    mustChangePassword: false,
    bio: "Kerem specializes in new developments across Ankara and Izmir, blending data-driven insights with a concierge-level client experience.",
    specialties: ["New Developments", "Family Homes", "Investment Advisory"],
    experience: 8,
    rating: 4.8,
    propertiesSold: 192,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    marketCountry: "Turkey"
  },
  {
    email: "olivia.bennett@realestate.com",
    password: "Agent123!",
    firstName: "Olivia",
    lastName: "Bennett",
    phone: "+1 212 555 0199",
    role: "agent",
    isActive: true,
    createdByAdmin: true,
    mustChangePassword: false,
    bio: "Olivia leads our New York City team, representing penthouses, pied-à-terres, and turnkey condos spanning Manhattan and Brooklyn.",
    specialties: ["NYC Penthouses", "Luxury Condos", "Relocation"],
    experience: 12,
    rating: 4.95,
    propertiesSold: 310,
    avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80",
    marketCountry: "USA"
  },
  {
    email: "marcus.reed@realestate.com",
    password: "Agent123!",
    firstName: "Marcus",
    lastName: "Reed",
    phone: "+1 737 555 4411",
    role: "agent",
    isActive: true,
    createdByAdmin: true,
    mustChangePassword: false,
    bio: "Austin-based Marcus pairs tech startup savvy with neighborhood expertise to help clients acquire modern homes and investment rentals.",
    specialties: ["Modern Homes", "Investment Rentals", "Tech Relocations"],
    experience: 9,
    rating: 4.87,
    propertiesSold: 205,
    avatar: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=300&q=80",
    marketCountry: "USA"
  },
  {
    email: "amelia.clarke@realestate.com",
    password: "Agent123!",
    firstName: "Amelia",
    lastName: "Clarke",
    phone: "+44 20 7946 0822",
    role: "agent",
    isActive: true,
    createdByAdmin: true,
    mustChangePassword: false,
    bio: "Amelia curates prime properties across Kensington, Chelsea, and the City, with discreet representation for UHNW buyers.",
    specialties: ["Prime Central London", "Townhouses", "Private Clients"],
    experience: 14,
    rating: 5,
    propertiesSold: 342,
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
    marketCountry: "UK"
  },
  {
    email: "jasper.collins@realestate.com",
    password: "Agent123!",
    firstName: "Jasper",
    lastName: "Collins",
    phone: "+44 161 555 7744",
    role: "agent",
    isActive: true,
    createdByAdmin: true,
    mustChangePassword: false,
    bio: "Based in Manchester, Jasper focuses on design-forward lofts, adaptive reuse projects, and high-yield rental portfolios across the North of England.",
    specialties: ["Lofts", "Redevelopment Projects", "Rental Portfolios"],
    experience: 7,
    rating: 4.85,
    propertiesSold: 178,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    marketCountry: "UK"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});
    console.log("Cleared existing data");

    const admin = await User.create({
      email: "admin@realestate.com",
      password: "Admin123!",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true
    });
    console.log("Created admin user");

    const agents: IUser[] = [];
    for (const agentData of agentSeedData) {
      const agent = await User.create(agentData);
      agents.push(agent);
    }
    console.log(`Created ${agents.length} agents`);

    const agentsByCountry = agents.reduce<Record<string, IUser[]>>((acc, agent) => {
      const key = agent.marketCountry || "USA";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(agent);
      return acc;
    }, {});

    const agentRotation: Record<string, number> = {};
    const normalizeCountry = (value?: string) => {
      const normalized = (value || "").toLowerCase();
      if (normalized.includes("turk")) return "Turkey";
      if (normalized.includes("kingdom") || normalized === "uk" || normalized === "united kingdom") return "UK";
      return "USA";
    };

    const getAgentForCountry = (country?: string) => {
      const key = normalizeCountry(country);
      const pool = agentsByCountry[key] && agentsByCountry[key].length ? agentsByCountry[key] : agents;
      if (!agentRotation[key]) {
        agentRotation[key] = 0;
      }
      const index = agentRotation[key] % pool.length;
      agentRotation[key] += 1;
      return pool[index];
    };

    const users = [];
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        email: `user${i}@example.com`,
        password: "User123!",
        firstName: `User${i}`,
        lastName: `Johnson`,
        role: "user",
        isActive: true
      });
      users.push(user);
    }
    console.log(`Created ${users.length} regular users`);

    const properties: IProperty[] = [];
    for (let i = 0; i < propertySeedData.length; i++) {
      const base = propertySeedData[i];
      const agent = getAgentForCountry(base.address?.country);
      const isApproved = base.status === "approved";

      const property = await Property.create({
        ...base,
        images: getImagesByType(base.type), // Use category-specific images
        agent: agent._id,
        approvedBy: isApproved ? admin._id : undefined,
        approvedAt: isApproved ? new Date() : undefined
      });
      properties.push(property);
    }
    console.log(`Created ${properties.length} properties`);

    const approvedProperties = properties.filter(p => p.status === "approved");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const favCount = Math.floor(Math.random() * 5) + 1;
      const favProps: Types.ObjectId[] = [];
      for (let j = 0; j < favCount; j++) {
        const randomProp = approvedProperties[Math.floor(Math.random() * approvedProperties.length)];
        const propId = randomProp._id as Types.ObjectId;
        if (!favProps.some(id => id.equals(propId))) {
          favProps.push(propId);
        }
      }
      user.favorites = favProps;
      await user.save();
    }
    console.log("Added favorites to users");

    const bookings = [];
    for (let i = 0; i < 20; i++) {
      const property = approvedProperties[Math.floor(Math.random() * approvedProperties.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const daysAhead = Math.floor(Math.random() * 30) + 1;
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + daysAhead);

      const statuses: Array<"pending" | "confirmed" | "cancelled" | "completed"> = ["pending", "confirmed", "confirmed", "cancelled", "completed"];
      const status = statuses[i % statuses.length];

      const booking = await Booking.create({
        property: property._id,
        user: user._id,
        agent: property.agent,
        visitDate,
        visitTime: `${Math.floor(Math.random() * 8) + 10}:00`,
        status,
        message: "I'm interested in viewing this property. Looking forward to the visit!"
      });
      bookings.push(booking);
    }
    console.log(`Created ${bookings.length} bookings`);

    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const property = approvedProperties[Math.floor(Math.random() * approvedProperties.length)];

      await Notification.create({
        user: user._id,
        type: "favorite_update",
        title: "Favorite Property Updated",
        message: `${property.title} has been updated with new information`,
        relatedProperty: property._id,
        read: Math.random() > 0.5
      });
    }
    console.log("Created notifications");

    console.log("\n=== SEED COMPLETE ===");
    console.log("\nTest Accounts:");
    console.log("Admin: admin@realestate.com / Admin123!");
    console.log("Agents: agent1@realestate.com to agent5@realestate.com / Agent123!");
    console.log("Users: user1@example.com to user10@example.com / User123!");
    console.log("\nStats:");
    console.log(`- ${agents.length} agents`);
    console.log(`- ${users.length} regular users`);
    console.log(`- ${properties.length} properties (${approvedProperties.length} approved)`);
    console.log(`- ${bookings.length} bookings`);

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
