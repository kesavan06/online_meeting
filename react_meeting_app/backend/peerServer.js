const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 4001,
  path: "/peerjs",
  allow_discovery: true,
  corsOptions: {
    origin: "*", // Allows all origins (change if needed)
    allowedHeaders: ["Origin", "Content-Type", "Accept"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("PeerJS Server is running on http://localhost:4001");
