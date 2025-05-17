import { Router } from "express";
import {usersignup} from "../controllers/user.controller.js";

const router = Router()

router.route("/signup").post(usersignup)


