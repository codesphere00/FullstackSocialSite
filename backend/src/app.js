const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Allow requests from the React frontend
// In production, set FRONTEND_URL env var to your Vercel URL
const allowedOrigins = [
  process.env.FRONTEND_URL,        // e.g. https://your-app.vercel.app
  "http://localhost:5173",          // Vite dev server
  "http://localhost:3000",          // fallback
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;