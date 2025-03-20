import express from "express"

import { searchNewUsers, updateUserProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const UserRouter = express.Router();


UserRouter.get("/search",isAuthenticated,searchNewUsers)
UserRouter.put("/update-profile",isAuthenticated,updateUserProfile)




export default UserRouter;