import express from "express";
import { protectRoute } from "../middleware/middleware.js";
import {
    addComments,
  createPost,
  deletePost,
  getPostById,
  getPosts,
  likePost,
} from "../controllers/post.controller.js";
const router = express.Router();
router.get("/", protectRoute, getPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/post/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, addComments);
router.post("/:id/like", protectRoute, likePost);
export default router;
