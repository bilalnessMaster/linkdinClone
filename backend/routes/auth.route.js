import express from 'express';
import { Logout, profile, signIn, signUp } from '../controllers/auth.controller.js';
import {protectRoute} from '../middleware/middleware.js'
const router = express.Router()

router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/loggout',Logout)
router.get('/me',protectRoute,profile)


export default router;