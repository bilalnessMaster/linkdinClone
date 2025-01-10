import express from "express";
import { protectRoute } from "../middleware/middleware.js";
import {
  deleteNotification,
  getNotification,
  markNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();

router.get("/", protectRoute, getNotification);
router.put("/:id/read", protectRoute, markNotification);
router.delete("/:id/delete", protectRoute, deleteNotification);

export default router;
