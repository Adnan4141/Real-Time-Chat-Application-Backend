import { Server } from "socket.io";

const userSocketMap = {};

export const initializeSocket = (server) => {
  const users = new Map();
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    

    const userId = socket.handshake.query.userId;
  
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("send_message", (data) => {
      io.emit("received_message", data);
    });




    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);

      setTimeout(()=>{
 delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      },10000)
     
    });
  });

  return io;
};
