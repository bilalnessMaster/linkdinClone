import express from "express";
import { protectRoute } from "../middleware/middleware.js";
import {
  acceptConnecttionRequest,
  getConnectionRequests,
  getstatus,
  getUserConnections,
  rejectConnecttionRequest,
  removeUserFromConnection,
  sendConnectionRequest,
} from "../controllers/connections.controller.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectRoute, acceptConnecttionRequest);
router.put("/reject/:requestId", protectRoute, rejectConnecttionRequest);
router.get("/requests", protectRoute, getConnectionRequests);
router.get("/", protectRoute, getUserConnections);
router.delete("/:userId", protectRoute, removeUserFromConnection);
router.get("/status/:userId", protectRoute, getstatus);

export default router;
