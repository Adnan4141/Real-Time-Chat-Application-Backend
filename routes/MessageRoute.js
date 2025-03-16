import express from "express"
import { deleteMessage, newMessageCreate } from "../controllers/MessageController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
const MessageRouter = express.Router();


MessageRouter.post("/:id",isAuthenticated,newMessageCreate)
// MessageRouter.post("/:id",isAuthenticated,newMessageCreate)
// MessageRouter.put("/:id")
MessageRouter.delete("/:id",isAuthenticated,deleteMessage)




export default MessageRouter;