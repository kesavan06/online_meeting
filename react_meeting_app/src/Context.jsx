import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const roomId = useRef(null); // Consider passing this as a prop if dynamic
  const socketRef = useRef(null);
  const [streamState, setStreamsState] = useState([]);
  const [screenStreamState, setScreenStreamState] = useState(null);
  const user_name = useRef({}); // Rename for clarity
  const myStream = useRef(null);
  const myScreenStream = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // Use Map for better key management
  const candidateQueues = useRef(new Map()); // Queue ICE candidates per peer

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      // Add TURN server if needed for NAT traversal
    ],
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3002", {
      transports: ["websocket"],
    });
    setupSocketListeners();

    return () => {
      socketRef.current?.disconnect();
      if (myStream.current) {
        myStream.current.getTracks().forEach((track) => track.stop());
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
    };
  }, []);

  const setupSocketListeners = () => {
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("user-connected", async (userId) => {
      if (userId === socketRef.current.id) return; // Ignore self
      console.log("User connected:", userId);
      if (myStream.current) {
        await createPeerConnection(userId, true);
      }
    });

    socketRef.current.on("offer", async ({ offer, from }) => {
      console.log("Received offer from:", from);
      await handleOffer(offer, from);
    });

    socketRef.current.on("answer", async ({ answer, from }) => {
      console.log("Received answer from:", from);
      await handleAnswer(answer, from);
    });

    socketRef.current.on("ice-candidate", async ({ candidate, from }) => {
      console.log("Received ICE candidate from:", from);
      await handleNewICECandidate(candidate, from);
    });

    socketRef.current.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
      removePeerConnection(userId);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });
  };

  const createPeerConnection = async (userId, isInitiator) => {
    if (peerConnectionsRef.current.has(userId)) return; // Avoid duplicates

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionsRef.current.set(userId, peerConnection);
    candidateQueues.current.set(userId, []); // Initialize candidate queue

    // Add local stream tracks
    if (myStream.current) {
      myStream.current
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, myStream.current));
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          candidate: event.candidate,
          to: userId,
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        console.log("Remote stream received:", remoteStream.id);
        addVideoStream(remoteStream);
      }
    };

    // Monitor connection state
    peerConnection.oniceconnectionstatechange = () => {
      console.log(`${userId}: ICE state: ${peerConnection.iceConnectionState}`);
      if (peerConnection.iceConnectionState === "disconnected") {
        removePeerConnection(userId);
      }
    };

    if (isInitiator) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current.emit("offer", { offer, to: userId });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    }

    return peerConnection;
  };

  const handleOffer = async (offer, from) => {
    if (from === socketRef.current.id) return; // Ignore self
    const peerConnection = await createPeerConnection(from, false);
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socketRef.current.emit("answer", { answer, to: from });

      // Flush any queued candidates
      const queue = candidateQueues.current.get(from) || [];
      for (const candidate of queue) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
      candidateQueues.current.set(from, []);
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const handleAnswer = async (answer, from) => {
    const peerConnection = peerConnectionsRef.current.get(from);
    if (!peerConnection) {
      console.warn(`No peer connection found for ${from}`);
      return;
    }
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      // Flush queued candidates
      const queue = candidateQueues.current.get(from) || [];
      for (const candidate of queue) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
      candidateQueues.current.set(from, []);
    } catch (err) {
      console.error("Error handling answer:", err);
    }
  };

  const handleNewICECandidate = async (candidate, from) => {
    const peerConnection = peerConnectionsRef.current.get(from);
    if (!peerConnection) {
      console.warn(`No peer connection for ${from}, queuing candidate`);
      candidateQueues.current.set(from, [
        ...(candidateQueues.current.get(from) || []),
        candidate,
      ]);
      return;
    }
    try {
      if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        // Queue candidate if remote description isn't set
        candidateQueues.current.set(from, [
          ...(candidateQueues.current.get(from) || []),
          candidate,
        ]);
      }
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  };

  const removePeerConnection = (userId) => {
    const pc = peerConnectionsRef.current.get(userId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(userId);
      candidateQueues.current.delete(userId);
      setStreamsState((prev) => prev.filter((s) => s.id !== userId));
    }
  };

  const addVideoStream = (stream) => {
    if (!stream || !(stream instanceof MediaStream)) {
      console.warn("Invalid stream provided to addVideoStream");
      return;
    }
    setStreamsState((prevStreams) => {
      if (!prevStreams.some((s) => s.id === stream.id)) {
        console.log("Stream added:", stream.id);
        return [...prevStreams, stream];
      }
      return prevStreams;
    });
  };

  const startScreenShare = async () => {
    if (screenStreamState) {
      console.log(
        "Screen sharing already active by:",
        screenStreamState.userId
      );
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Enable audio sharing if needed
      });

      myScreenStream.current = screenStream;

      // Add tracks from screen stream to all existing peer connections
      peerConnectionsRef.current.forEach((peerConnection) => {
        screenStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, screenStream);
        });
      });

      // Set local screen stream state
      setScreenStreamState({
        userId: socketRef.current.id,
        stream: screenStream,
      });

      addVideoStream(screenStream);

      // Notify other participants about screen sharing
      socketRef.current.emit("screen-sharing-started", roomId.current);

      // Handle stream stop
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenSharing();
      };
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  const stopScreenSharing = () => {
    if (myScreenStream.current) {
      myScreenStream.current.getTracks().forEach((track) => track.stop());

      // Remove screen sharing tracks from peer connections
      peerConnectionsRef.current.forEach((peerConnection) => {
        peerConnection.getSenders().forEach((sender) => {
          if (sender.track && sender.track.kind === "video") {
            peerConnection.removeTrack(sender);
          }
        });
      });
    }

    myScreenStream.current = null;
    setScreenStreamState(null);
    socketRef.current.emit("screen-share-stopped", roomId.current);
  };
  useEffect(() => {
    console.log("screenStreamState updated:", screenStreamState);
  }, [screenStreamState]);

  const getMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myStream.current = stream;
    return stream;
  };

  const initializeMediaStream = async () => {
    try {
      addVideoStream(myStream.current);
      if (roomId.current) {
        socketRef.current.emit(
          "join-room",
          roomId.current,
          socketRef.current.id,
          userShowName
        );
      } else {
        console.warn("Room ID not set!");
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        roomId,
        socketRef,
        getMediaStream,
        initializeMediaStream,
        startScreenShare,
        streams: streamState,
        screenStream: screenStreamState,
        myStream,
        user_name,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
