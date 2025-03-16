import express from "express"

import { searchNewUsers } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const UserRouter = express.Router();


UserRouter.get("/search",isAuthenticated,searchNewUsers)




export default UserRouter;