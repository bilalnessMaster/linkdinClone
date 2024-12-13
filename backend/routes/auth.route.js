import express from 'express';
import { Logout, signIn, signUp } from '../controllers/auth.controller.js';
const router = express.Router()

router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/logout',Logout)


export default router;