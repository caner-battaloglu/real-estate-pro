import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// global middleware first
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// routes next
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong from Express + TypeScript!' });
});

// 404 after routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// error handler last
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
