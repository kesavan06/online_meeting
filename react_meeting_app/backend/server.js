const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  },
});

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  // optionsSuccessStatus: 200
};



let allMessages=[];


app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room creation
  socket.on("create-room", (roomId) => {
    console.log(`Room created: ${roomId}`);
    if (!rooms[roomId]) {
      console.log("roomId: ", roomId);
      rooms[roomId] = new Set(); // Create a new room
    }
    socket.emit("room-created", roomId); // Notify the client that the room was created
  });

  // Handle joining an existing room
  socket.on("join-existing-room", (roomId) => {
    console.log(`User attempting to join room: ${roomId}`);
    if (rooms[roomId]) {
      socket.emit("room-exists", { exists: true, roomId }); // Notify the client that the room exists
    } else {
      socket.emit("room-exists", { exists: false }); // Notify the client that the room does not exist
    }
  });

  // Handle joining a room
  socket.on("join-room", (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
   
    rooms[roomId].add(userId); // Add the user to the room
    socket.join(roomId); // Join the socket room
    socket.to(roomId).emit("user-connected", userId);


    // send Message

    socket.on("sendMessage", (msgObject)=>{
      console.log("Message Received from ",socket.id," Message: ",msgObject);
      console.log("SenderId: ",msgObject.sender_id);
      console.log("Room: ",msgObject.room_id);

      allMessages.push({user_name:msgObject.user_name, message: msgObject.message});
       console.log("ALl messages: ",allMessages);

     io.to(msgObject.room_id).emit("receivedMessage", (msgObject));
    })





    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      rooms[roomId].delete(userId); // Remove the user from the room
      socket.to(roomId).emit("user-disconnected", userId); // Notify other users
    });
  });
});

server.listen(3002, () => {
  console.log(`Server running on port 3002`);
});
