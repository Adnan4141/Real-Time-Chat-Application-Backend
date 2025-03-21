import { Server } from "socket.io"



export const  initializeSocket = (server)=>{
   
   const users = new Map()
  const io = new Server(server,{
   cors: {
      origin:  [
        process.env.SOCKET_ORIGIN_URL ,
         "http://localhost:5173"
      ], 
      methods: ["GET", "POST"],
      credentials: true
    },
  })
    
  
   io.on("connection",(socket)=>{
      console.log("A user connected:", socket.id);
   
     socket.on("send_message",(data)=>{
       io.emit("received_message",data)
     })

     socket.on("disconnect",()=>{
      console.log("User disconnected: ",socket.id);

      // for(const [userId,socketId] of activeUsers.entries()){
      //    if([socketId==socket.id]){
      //       activeUsers.delete(userId)
      //       io.emit("active_users", Array.from(activeUsers.keys())); 
      //    }
      //    break;
      // }

     })

   })




return io;
}