import 'dotenv/config';


const PORT = process.env.PORT ?? '3000';
type NodeEnv = 'development' | 'test' | 'production';
const NODE_ENV = (process.env.NODE_ENV ?? 'development') as NodeEnv;

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('MONGO_URI is required. Add it to your .env file.');
}

export const env = {
  PORT,
  NODE_ENV,
  MONGO_URI,
} as const;