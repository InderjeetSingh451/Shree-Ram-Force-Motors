import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";
import {
  addStaff,
  getAllStaff,
  getStaffById,
  giveSalary,
  deleteStaff,
} from "../controller/staffController.js";

const staffRoute = express.Router();

staffRoute.get("/", authMiddleware, getAllStaff);
staffRoute.get("/:id", authMiddleware, getStaffById);
staffRoute.post("/add", authMiddleware, upload.single("imageUrl"), addStaff);
staffRoute.post("/:id/give-salary", authMiddleware, giveSalary);
staffRoute.delete("/:id", authMiddleware, deleteStaff);

export default staffRoute;
