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
   origin: "*",
   // methods: ["GET", "POST", "PUT", "DELETE"],  
   // credentials: true,  
 };


app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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

app.get("/data",(req,res)=>{
   res.send([
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "s3cr3tP@ss",
        "avatar": "https://example.com/avatar1.jpg",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA"
        },
        "phone": "+1-555-555-5555",
        "createdAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      },
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "password": "p@ssw0rd",
        "avatar": "https://example.com/avatar2.jpg",
        "address": {
          "street": "456 Elm St",
          "city": "Los Angeles",
          "state": "CA",
          "zipCode": "90001",
          "country": "USA"
        },
        "phone": "+1-555-555-5556",
        "createdAt": "2023-02-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      }
    ])
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