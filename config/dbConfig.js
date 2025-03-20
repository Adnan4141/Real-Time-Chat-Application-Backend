import mongoose from "mongoose";


const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/chat-application";


const connectDB = async()=>{
try {
   const conn = await mongoose.connect(dbUrl,{
      serverSelectionTimeoutMS: 5000,
   })
   console.log(`Mongodb connected at: ${conn.connection.host}`)
} catch (error) {
   console.log(`Mongodb Connection Error: ${error.message}`)
   process.exit(1);
}
}

export default connectDB;