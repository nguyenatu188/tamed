import express from "express"
import { login, logout, register, getMe } from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router()

router.get("/me", protectRoute ,getMe)

// <url>/api/auth/login
router.post("/login", login)

// <url>/api/auth/logout
router.post("/logout", logout)

// <url>/api/auth/register
router.post("/register", register)

export default router