const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// const viewPath = path.join(__dirname, "/views");

// app.set("views", viewPath);
// app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const rooms = {};

// Render the home page
app.get("/", (req, res) => {
  res.render("home");
});


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle room creation
  socket.on("create-room", (roomId) => {
    console.log(`Room created: ${roomId}`);
    if (!rooms[roomId]) {
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
    const allSockets = Array.from(io.sockets.sockets.keys());
    console.log("All Connected Sockets:", allSockets);
    socket.to(roomId).emit("user-connected", userId); // Notify other users in the room

    // Handle user disconnection
    socket.on("disconnect", () => {

      console.log(`User ${userId} disconnected from room ${roomId}`);
      rooms[roomId].delete(userId); // Remove the user from the room
      socket.to(roomId).emit("user-disconnected", userId); // Notify other users
    });
  });
});

// Start the server
server.listen(3010, () => {
  console.log("Server running on http://localhost:3010");
});
u