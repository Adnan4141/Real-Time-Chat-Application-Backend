import express from "express";
import { deleteConversion, getConversionsList, getConverstionsMessage, markMessageAsSeen, newConversionCreate } from "../controllers/conversionController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const ConversionRouter = express.Router();


ConversionRouter.post('/new',isAuthenticated,newConversionCreate)
ConversionRouter.get('/',isAuthenticated,getConversionsList)
ConversionRouter.get('/:id',isAuthenticated,getConverstionsMessage)
ConversionRouter.delete('/:id',isAuthenticated,deleteConversion)
ConversionRouter.put('/markAsSeen/:id',isAuthenticated,markMessageAsSeen)







export default ConversionRouter;