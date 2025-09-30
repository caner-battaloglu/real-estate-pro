import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import propertyRoutes from './routes/propertyRoutes';
import agentRoutes from './routes/agentRoutes'

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json()); // parse JSON

// Health check
app.get('/ping', (_req, res) => {
  res.json({ message: 'pong from Express + TypeScript!' });
});

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);

// Start server only after DB is connected
async function start() {
  try {
    // MONGO_URI like: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/realestate?retryWrites=true&w=majority
    // If your password has special chars, percent-encode it (e.g., '@' -> %40).
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB connected');

    app.listen(env.PORT, () => {
      console.log(`Server listening on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
