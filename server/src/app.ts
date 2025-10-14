import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./db/connect";
import { errorHandler } from "./middleware/errorHandler";
import agentRoutes from "./routes/agentRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import authRoutes from "./routes/authRoutes";


// Always load env from server/.env regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/properties", propertyRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/real_estate_pro";

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

export default app;
