import { Server } from "socket.io"

const activeUsers = new Map();

export const  initializeSocket = (server)=>{
 
  const io = new Server(server,{
   cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
    },
  })

   io.on("connection",(socket)=>{
      console.log("A user connected:", socket.id);

     socket.on("user_login",(userId)=>{
         activeUsers.set(userId,socket.id)
         io.emit("active_users",Array.from(activeUsers.keys()))
     })

     socket.on("user_logout",(userId)=>{
         activeUsers.delete(userId)
         io.emit("active_users",Array.from(activeUsers.keys()))
     })

     socket.on("send_message",(data)=>{
       const {receiverId,message} = data;
       const receiverSocketId = activeUsers.get(receiverId);
        if(receiverSocketId){
          io.to(receiverSocketId).emit("received_message",message);

        }
     })

     socket.on("disconnect",()=>{
      console.log("User disconnected: ",socket.id);

      for(const [userId,socketId] of activeUsers.entries()){
         if([socketId==socket.id]){
            activeUsers.delete(userId)
            io.emit("active_users", Array.from(activeUsers.keys())); 
         }
         break;
      }

     })

   })




return io;
}