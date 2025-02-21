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
  let socketRef = useRef(null);
  // let streams = useRef([]);
  const [streamState, setStreamsState] = useState([]);
  let user_name = useRef({});
  let myStream = useRef(null);
  let peerConnectionsRef = useRef({});

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3002");
    setupSocketListeners();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (myStream.current) {
        myStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const setupSocketListeners = () => {
    socketRef.current.on("user-connected", async (userId) => {
      console.log("User connected:", userId);
      if (myStream.current) {
        try {
          await createPeerConnection(userId, true);
        } catch (err) {
          console.log("Error creating peer connection: ", err);
        }
      }
    });

    socketRef.current.on("offer", async ({ offer, from }) => {
      console.log("Received offer from: ", from);
      await handleOffer(offer, from);
    });

    socketRef.current.on("answer", async ({ answer, from }) => {
      console.log("Received answer from:", from);
      await handleAnswer(answer, from);
    });

    socketRef.current.on("ice-candidate", async ({ candidate, from }) => {
      console.log("Recieived ICE candidate from: ", from);
      await handleNewICECandidate(candidate, from);
    });

    socketRef.current.on("user-disconnected", (userId) => {
      console.log("User disconenected:", userId);
      if (peerConnectionsRef.current[userId]) {
        peerConnectionsRef.current[userId].close();
        delete peerConnectionsRef.current[userId];
      }
    });
    socketRef.current.on("error", (error) => {
      console.log("Socket error: ", error);
    });
  };

  const createPeerConnection = async (userId, isInitiator) => {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionsRef.current[userId] = peerConnection;

    if (myStream.current) {
      myStream.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, myStream.current);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          candidate: event.candidate,
          to: userId,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("Remote stream received:", event.streams);
      const [remoteStream] = event.streams;
      if (remoteStream) {
        addVideoStream(remoteStream);
      }
    };

    if (isInitiator) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current.emit("offer", {
          offer,
          to: userId,
        });
      } catch (err) {
        console.log("Error creating offer:", err);
      }
    }
    return peerConnection;
  };

  const handleOffer = async (offer, from) => {
    const peerConnection = await createPeerConnection(from, false);
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socketRef.current.emit("answer", {
        answer,
        to: from,
      });
    } catch (err) {
      console.log("Error handling offer:", err);
    }
  };

  const handleAnswer = async (answer, from) => {
    try {
      const peerConnection = peerConnectionsRef.current[from];
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (err) {
      console.log("Error handling answer: ", err);
    }
  };

  const handleNewICECandidate = async (candidate, from) => {
    try {
      const peerConnection = peerConnectionsRef.current[from];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.log("Error adding ICE candidate:", error);
    }
  };

  const addVideoStream = (stream) => {
    if (!stream || !(stream instanceof MediaStream)) {
      console.log("No stream provided to addVideoStream");
      return;
    }
    console.log("Adding stream: ", stream.id);
    setStreamsState((prevStreams) => {
      const exists = prevStreams.some((s) => s.id === stream.id);
      if (!exists) {
        console.log("Stream added to state");
        return [...prevStreams, stream];
      }
      console.log("stream already exists");
      return prevStreams;
    });
  };

  const initializeMediaStream = async () => {
    console.log("Initializing media stream");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });
      myStream.current = stream;
      addVideoStream(stream);

      socketRef.current.emit("join-room", roomId.current, socketRef.current.id);
    } catch (err) {
      console.log("Error accessing media devices:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        roomId,
        socketRef,
        initializeMediaStream,
        streams: streamState,
        myStream,
        user_name,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
