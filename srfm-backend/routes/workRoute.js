import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addWork,
  getAllWork,
  getPendingWork,
  markWorkDone,
  markWorkCancelled,
} from "../controller/workController.js";

const workRoute = express.Router();

workRoute.get("/", authMiddleware, getAllWork);
workRoute.get("/pending", authMiddleware, getPendingWork);
workRoute.post("/add", authMiddleware, addWork);
workRoute.put("/:id/done", authMiddleware, markWorkDone);
workRoute.put("/:id/cancel", authMiddleware, markWorkCancelled);

export default workRoute;
