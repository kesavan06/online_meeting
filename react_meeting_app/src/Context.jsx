import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  let roomId = useRef(null);
  let peerRef = useRef(null);
  let socketRef = useRef(null);
  let peersRef = useRef({});
  let streams = useRef([]);
  let [myStream, setMyStream] = useState(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3002");
  }, []);

  const initializeMediaStream = () => {
    console.log("Initializing media stream");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Media stream obtained");
        setMyStream(stream);
        addVideoStream(stream); // Add the local video stream
        console.log("Video stream added locally completed");
        // Create a completely new Peer instance

        peerRef.current = new Peer(undefined, {
          host: "0.peerjs.com",
          port: 443,
          secure: true,
          debug: 3,
        });

        peerRef.current.on("open", (id) => {
          console.log(`✅ New Peer connected! ID: ${id}`);
          console.log("Room Id", roomId.current);

          socketRef.current.emit("join-room", roomId.current, id);
        });

        peerRef.current.on("error", (err) => {
          console.error("❌ Peer error:", err);
        });

        // Handle incoming calls
        peerRef.current.on("call", (call) => {
          console.log(`Receiving call from: ${call.peer}`);
          console.log(myStream);
          call.answer(myStream); // Answer the call with the local stream

          call.on("stream", (userVideoStream) => {
            console.log(`Received stream from: ${call.peer}`);
            addVideoStream(userVideoStream); // Add the remote video stream
          });
        });

        // Handle new user connections
        socketRef.current.on("user-connected", (userId) => {
          console.log(`User connected: ${userId}`);
          connectToNewUser(userId, myStream); // Connect to the new user
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  function connectToNewUser(userId, stream) {
    console.log(`Connecting to new user: ${userId}`);
    const call = peerRef.current.call(userId, stream); // Call the new user
    // const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      console.log(`Received stream from: ${userId}`);
      addVideoStream(userVideoStream); // Add the remote video stream
    });

    call.on("close", () => {
      console.log(`Call closed for: ${userId}`);
    });
    peersRef.current[userId] = call; // Store the call in the peers object
  }

  const addVideoStream = (stream) => {
    if (!stream) {
      console.error("No stream provided to addVideoStream");
      return;
    }
    console.log(stream);
    streams.current = [...streams.current, stream];
    console.log("Stream added:", streams.current);
  };

  useEffect(() => {
    socketRef.current.on("user-disconnected", (userId) => {
      console.log(`User disconnected: ${userId}`);
      if (peersRef.current[userId]) {
        peersRef.current[userId].close(); // Close the peer connection
        delete peersRef.current[userId]; // Remove the peer from the peers object
      }
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        roomId,
        peerRef,
        socketRef,
        peerRef,
        initializeMediaStream,
        streams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
