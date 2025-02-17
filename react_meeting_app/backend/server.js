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

// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true,
//   // optionsSuccessStatus: 200
// };

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  // res.cookie("your_cookie", "value", {
  //   sameSite: "None", // ✅ Allow cross-site requests
  //   secure: true, // ✅ Required for cross-site cookies
  //   httpOnly: true, // Prevents XSS attacks
  // });

  res.json({ message: "Hello from Backend!" });
});

io.on("connection", (socket) => {
  console.log("socket connected: ", socket.id);
  socket.on("send-message", (msg) => {
    console.log("Result: ", msg);
    
  })
});

server.listen(3007, () => {
  console.log(`Server running on port 3007`);
});
