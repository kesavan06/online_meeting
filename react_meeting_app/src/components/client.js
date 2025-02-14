import { io } from "socket.io-client";
import { peer } from "peer";

const socket = io("/");

const peerRef = new Peer(undefined, {
  host: "0.peerjs.com",
  port: 443,
  secure: true,
  debug: 3,
});

const peers = {};

let myStream = null;
let setRoomIdState = null;
let setRoomNameState = null;

const Client = (setRoomId, setRoomName, myVideoRef, videoGridRef) => {

}

// const videoGrid = document.getElementById("video-grid");
// const myVideo = document.createElement("video");
// myVideo.muted = true;

// let roomId;
// const homeContainer = document.getElementById("homeContainer");
// const roomContainer = document.getElementById("roomContainer");
// const roomIdDisplay = document.getElementById("roomIdDisplay");

// const createMeetingBtn = document.getElementById("createMeetingBtn");
// const joinMeetingBtn = document.getElementById("joinMeetingBtn");
// const roomname = document.getElementById("roomname");

// // Create a new room
// createMeetingBtn.addEventListener("click", () => {
//   console.log("Create meeting button clicked");
//   roomId = Math.random().toString(36).substring(2, 9); // Generate a random room ID
//   socket.emit("create-room", roomId); // Emit create-room event to the server
// });

// // Join an existing room
// joinMeetingBtn.addEventListener("click", () => {
//   console.log("Join meeting button clicked");
//   if (roomname.value.length > 0) {
//     socket.emit("join-existing-room", roomname.value); // Emit join-existing-room event to the server
//   } else {
//     alert("Please enter a room name");
//   }
// });

// // Handle room creation
// socket.on("room-created", (newRoomId) => {
//   console.log(`Room created: ${newRoomId}`);
//   showRoomView(newRoomId); // Show the room view
//   initializeMediaStream(); // Initialize the media stream
// });

// // Handle joining an existing room
// socket.on("room-exists", (res) => {
//   console.log(`Room exists check: ${res.exists}`);
//   if (res.exists) {
//     showRoomView(res.roomId); // Show the room view
//     initializeMediaStream(); // Initialize the media stream
//   } else {
//     alert("Room does not exist!");
//   }
// });

// // Show the room view
// function showRoomView(id) {
//   console.log(`Showing room view for room: ${id}`);
//   homeContainer.classList.add("hidden"); // Hide the home container
//   roomContainer.classList.remove("hidden"); // Show the room container
//   roomIdDisplay.textContent = id; // Update the room ID display
//   roomId = id; // Set the current room ID
// }

// // Initialize media stream and set up peer connections
// function initializeMediaStream() {
//   console.log("Initializing media stream");
//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then((stream) => {
//       console.log("Media stream obtained");
//       myStream = stream;
//       addVideoStream(myVideo, stream); // Add the local video stream
//       console.log("Video stream added locally completed");

//       peer = new Peer(undefined, {
//         host: "0.peerjs.com",
//         port: 443,
//         secure: true,
//         debug: 3,
//       });

//       peer.on("open", (id) => {
//         console.log(`✅ New Peer connected! ID: ${id}`);
//         socket.emit("join-room", roomId, id);

//         socket.on("user-connected", (userId) => {
//           console.log(`User connected: ${userId}`);

//           setTimeout(() => {
//             connectToNewUser(userId, myStream); // Connect to the new user
//           }, 3000);
//         });
//       });

//       peer.on("error", (err) => {
//         console.error("Peer error:", err);
//       });

//       // Handle incoming calls-------------------------------------------------Not working
//       peer.on("call", (call) => {
//         console.log(`Receiving call from: ${call.peer}`);
//         call.answer(myStream); // Answer the call with the local stream
//         const video = document.createElement("video");

//         call.on("stream", (userVideoStream) => {
//           console.log(`Received stream from: ${call.peer}`);
//           addVideoStream(video, userVideoStream); // Add the remote video stream
//         });
//       });

//       // Handle new user connections
//     })
//     .catch((error) => {
//       console.error("Error accessing media devices:", error);
//     });
// }

// // Connect to a new user
// function connectToNewUser(userId, stream) {
//   console.log(`Connecting to new user: ${userId}`);
//   const call = peer.call(userId, stream); // Call the new user
//   const video = document.createElement("video");

//   call.on("stream", (userVideoStream) => {
//     console.log(`Received stream from: ${userId}`);
//     addVideoStream(video, userVideoStream); // Add the remote video stream
//   });

//   call.on("close", () => {
//     console.log(`Call closed for: ${userId}`);
//     video.remove(); // Remove the video element
//   });
//   peers[userId] = call; // Store the call in the peers object
// }

// // Add a video stream to the video grid
// function addVideoStream(video, stream) {
//   if (!stream) {
//     console.error("No stream provided to addVideoStream");
//     return;
//   }
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//   });
//   videoGrid.append(video);
//   console.log("Video added to grid successfully");
// }

// // Handle user disconnections
// socket.on("user-disconnected", (userId) => {
//   console.log(`User disconnected: ${userId}`);
//   if (peers[userId]) {
//     peers[userId].close(); // Close the peer connection
//     delete peers[userId]; // Remove the peer from the peers object
//   }
// });
