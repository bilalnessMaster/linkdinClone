import express from "express";
import { protectRoute } from "../middleware/middleware.js";
import { sendConnectionRequest } from "../controllers/connections.controller.js";

const router = express.Router();

router.get('/',sendConnectionRequest)


export default router;
