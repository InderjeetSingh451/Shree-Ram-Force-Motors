import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getDashboard } from "../controller/dashboardController.js";

const dashboardRoute = express.Router();

dashboardRoute.get("/", authMiddleware, getDashboard);

export default dashboardRoute;
