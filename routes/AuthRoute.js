import express from "express"
import { login, register } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const authRouter = express.Router();


authRouter.post("/register",register)
authRouter.post("/login",login)




export default authRouter