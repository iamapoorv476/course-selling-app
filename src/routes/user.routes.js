import { Router } from "express";
import {usersignup,
    userlogin

} from "../controllers/user.controller.js";

const router = Router()

router.route("/signup").post(usersignup)
router.route("/login").post(userlogin)

export default router

