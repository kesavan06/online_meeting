import { io } from "socket.io-client";
// import { peer } from "peer";

const SOCKET_SERVER_URL = "http://localhost:3007";

export const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("socket connected");
  }
};

export const sendMessage = () => {
  console.log("send message;");

  socket.emit("send-message", "message from socket.jsx");
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
