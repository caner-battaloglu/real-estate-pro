import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User, IUser } from "../models/User";
import { Property, IProperty } from "../models/Property";
import { Booking } from "../models/Booking";
import { Notification } from "../models/Notification";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/real_estate_pro";

const propertyTypes = ["House", "Apartment", "Condo", "Villa", "Townhouse", "Studio"];
const cities = ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"];
const countries = ["Turkey"];

const propertyTitles = [
  "Luxury Sea View Apartment",
  "Modern City Center Condo",
  "Spacious Family Villa",
  "Cozy Studio Downtown",
  "Elegant Townhouse",
  "Contemporary Penthouse",
  "Charming Garden House",
  "Executive Business Suite",
  "Beachfront Paradise",
  "Mountain View Retreat"
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

    const agents = [];
    for (let i = 1; i <= 5; i++) {
      const agent = await User.create({
        email: `agent${i}@realestate.com`,
        password: "Agent123!",
        firstName: `Agent${i}`,
        lastName: `Smith`,
        role: "agent",
        isActive: true,
        createdByAdmin: true,
        mustChangePassword: false
      });
      agents.push(agent);
    }
    console.log(`Created ${agents.length} agents`);

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
    for (let i = 0; i < 30; i++) {
      const agent = agents[i % agents.length];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const country = countries[0];
      const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const title = propertyTitles[i % propertyTitles.length] + ` ${i + 1}`;

      const statuses: Array<"approved" | "pending" | "rejected"> = ["approved", "approved", "approved", "pending", "rejected"];
      const status = statuses[i % statuses.length];

      const property = await Property.create({
        title,
        description: `Beautiful ${type.toLowerCase()} located in ${city}. This property features modern amenities, spacious rooms, and excellent location. Perfect for families or individuals looking for comfort and style.`,
        price: Math.floor(Math.random() * 900000) + 100000,
        type,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 200) + 50,
        images: [
          `https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg`,
          `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg`,
          `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg`
        ],
        address: {
          line1: `${Math.floor(Math.random() * 500) + 1} Main Street`,
          city,
          country,
          postalCode: `${Math.floor(Math.random() * 90000) + 10000}`
        },
        location: `${city}, ${country}`,
        status,
        agent: agent._id,
        approvedBy: status !== "pending" ? admin._id : undefined,
        approvedAt: status !== "pending" ? new Date() : undefined,
        rejectionReason: status === "rejected" ? "Does not meet quality standards" : undefined
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
