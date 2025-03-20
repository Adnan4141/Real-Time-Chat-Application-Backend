import express from "express"
import errorHandler from "./utils/ErrorHandler/ErrorHandler.js";
import morgan from "morgan";
import cors from 'cors'
import "dotenv/config";
import connectDB from "./config/dbConfig.js";
import authRouter from "./routes/AuthRoute.js";
import cookieParser from "cookie-parser";
import ConversionRouter from "./routes/ConversionRoute.js";
import MessageRouter from "./routes/MessageRoute.js";
import UserRouter from "./routes/UserRoute.js";
import http from "http"
import { initializeSocket } from "./config/socket.js";


const app = express();
const expressServer = http.createServer(app);


const  io =  initializeSocket(expressServer);

const corsOptions = {
   origin: ["http://localhost:5173", "http://localhost:5174",process.env.FRONTEND_URL],  // Add any other origins as needed
   methods: ["GET", "POST", "PUT", "DELETE"],  
   credentials: true,  
 };


app.use(cookieParser());
app.use(express.json())
app.use(cors(corsOptions));
app.use(morgan("dev"))

app.use((req,res,next)=>{
   req.io = io;
   next();
})


app.use("/api/v1/auth",authRouter)
app.use("/api/v1/conversions",ConversionRouter)
app.use("/api/v1/messages",MessageRouter)
app.use("/api/v1/users",UserRouter)




app.get("/",(req,res)=>{
   res.send("Api is Working")
})






//for handling error
app.use(errorHandler)

//route error
app.use((req, res, next) => {
   res.status(404).json({
     message: "Route not found",
     success: false,
     error: true,
   });
 });


const PORT = process.env.PORT || 3000;
expressServer.listen(PORT,async()=>{
   console.log(`Server is running in http://localhost:${PORT}`)
   await connectDB();
})