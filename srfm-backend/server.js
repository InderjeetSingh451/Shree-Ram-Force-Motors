import express from "express";
import cors from "cors";
import "dotenv/config";
import DbConnect from "./config/db.js";
import connectCloudinary from "./config/cloudinaryConnect.js";
import authRoute from "./routes/authRoutes.js";
import staffRoute from "./routes/staffRoute.js";
import workRoute from "./routes/workRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

const app = express();

// middlewares
app.use(cors()); // for cross origin resource sharing
app.use(express.json()); // parse JSON body
DbConnect();
connectCloudinary();

// routes
app.use("/api/auth", authRoute);
app.use("/api/staff", staffRoute);
app.use("/api/work", workRoute);
app.use("/api/dashboard", dashboardRoute);

// server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
