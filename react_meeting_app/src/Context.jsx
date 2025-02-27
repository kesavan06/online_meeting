import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { startRecord, startScreenRecord } from "./Recording";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const roomId = useRef(null);
  const socketRef = useRef(null);
  const [streamState, setStreamsState] = useState([]);

  const [screenStreamState, setScreenStreamState] = useState(null);
  const user_name = useRef({});
  const myStream = useRef(null);
  const myScreenStream = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // Use Map for better key management
  const candidateQueues = useRef(new Map()); // Queue ICE candidates per peer
  let srceenSharer = useRef(null);
  const [isShare, setIsShare] = useState(false);
  const key = useRef({});
  const user_id = useRef({});
  let host = useRef(null);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      // Add TURN server if needed for NAT traversal
    ],
  };

  useEffect(() => {
    console.log(streamState);
  }, [streamState]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3002");
    setupSocketListeners();

    return () => {
      socketRef.current?.disconnect();
      if (myStream.current) {
        myStream.current.getTracks().forEach((track) => track.stop());
      }
      if (myScreenStream.current) {
        myScreenStream.current.getTracks().forEach((track) => track.stop());
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
      if (userId === socketRef.current.id) return;
      console.log("User connected:", userId);
      if (myStream.current || myScreenStream.current) {
        await createPeerConnection(userId, true); // Create peer connection and include screen share if active
      }
    });

    socketRef.current.on("screen-offer", async ({ offer, from }) => {
      try {
        const peerConnection = peerConnectionsRef.current.get(from);
        if (!peerConnection) {
          console.warn(`No peer connection for ${from}`);
          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socketRef.current.emit("screen-answer", {
          answer,
          to: from,
        });
      } catch (err) {
        console.error("Error handling screen offer:", err);
      }
    });

    socketRef.current.on("screen-answer", async ({ answer, from }) => {
      const peerConnection = peerConnectionsRef.current.get(from);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socketRef.current.on("screen-candidate", async ({ candidate, from }) => {
      const peerConnection = peerConnectionsRef.current.get(from);
      if (!peerConnection) {
        console.warn(
          `No peer connection for ${from}, queuing screen candidate`
        );
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
          candidateQueues.current.set(from, [
            ...(candidateQueues.current.get(from) || []),
            candidate,
          ]);
        }
      } catch (err) {
        console.error("Error adding screen ICE candidate:", err);
      }
    });

    socketRef.current.on("screen-sharing-stopped", (userId, streamId) => {
      console.log("Hello");
      if (screenStreamState?.userId === userId) {
        setScreenStreamState(null);
      }
      setStreamsState((prev) => {
        prev = prev.filter((videoStream) => {
          console.log(videoStream.stream.id, streamId);
          if (videoStream.stream.id == streamId) {
            // removePeerConnection(videoStream.userId);
            console.log(
              "after disconnected  screen: id",
              videoStream.stream.id,
              streamId
            );
          }

          if (videoStream.stream.id !== streamId) {
            return videoStream;
          }
        });
        console.log("After remove the screen share:", prev);
        return prev;
      });
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
      setStreamsState((prev) => {
        prev = prev.filter((videoStream) => {
          console.log(videoStream.userId, userId);
          if (videoStream.userId !== userId) {
            console.log(
              "after disconnected the connected users:",
              videoStream.userId
            );
            return videoStream;
          }
        });
        return prev;
      });

      setTimeout(() => {
        console.log("after user disconnect streams:", streamState);
      }, 500);
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

    if (myScreenStream.current) {
      myScreenStream.current
        .getTracks()
        .forEach((track) =>
          peerConnection.addTrack(track, myScreenStream.current)
        );
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

    const isScreenStream = (stream) => {
      const tracks = stream.getTracks();
      return tracks.length === 1 && tracks[0].kind === "video"; // Screen share typically has only video
    };

    const isCameraStream = (stream) => {
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      return videoTracks.length > 0 && audioTracks.length > 0; // Webcam usually has both
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      console.log("Remote stream: ", remoteStream.id);
      console.log("my screen stream: ", myScreenStream.id);
      if (remoteStream) {
        let type = isScreenStream(remoteStream) ? "screen" : "camera";
        console.log("Remote stream received:", remoteStream.id);
        addVideoStream({ stream: remoteStream, type: type, userId: userId });
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

  const addVideoStream = (videoStream) => {
    if (!videoStream) {
      console.warn("Invalid stream provided to addVideoStream");
      return;
    }
    setStreamsState((prevStreams) => {
      if (!prevStreams.some((s) => s.stream.id === videoStream.stream.id)) {
        console.log("Stream added:", videoStream.stream.id);
        console.log("bOTH sTREAM ", prevStreams, videoStream);

        return [...prevStreams, videoStream];
      }
      return prevStreams;
    });
  };

  const startScreenShare = async () => {
    let isScreenShare = streamState.some(
      (videoStream) => videoStream.type == "screen"
    );
    console.log(isScreenShare);
    if (isScreenShare) {
      console.log("Screen sharing already active");
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      myScreenStream.current = screenStream;
      startScreenRecord(screenStream);
      console.log(myScreenStream)
      setIsShare(true);
      srceenSharer.current = socketRef.current.id;
      // Add tracks from screen stream to all existing peer connections
      for (const [userId, peerConnection] of peerConnectionsRef.current) {
        screenStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, screenStream); // Add screen tracks to existing connection
        });

        // screenPeerConnection.onicecandidate = (event) => {
        //   if (event.candidate) {
        //     socketRef.current.emit("screen-candidate", {
        //       candidate: event.candidate,
        //       to: userId,
        //     });
        //   }
        // };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current.emit("screen-offer", {
          offer,
          to: userId,
          from: socketRef.current.id,
        });
      }

      // Set local screen stream state
      setScreenStreamState({
        userId: socketRef.current.id,
        stream: screenStream,
      });

      addVideoStream({
        stream: screenStream,
        type: "screen",
        userId: socketRef.current.id,
      });

      // Notify other participants about screen sharing
      socketRef.current.emit("screen-sharing-started", {
        roomId: roomId.current,
        userId: socketRef.current.id,
      });
      // Handle stream stop
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenSharing(screenStream);
      };
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  const stopScreenSharing = (screenStream) => {
    setStreamsState((prev) => {
      prev = prev.filter((videoStream) => {
        console.log(videoStream.stream.id, screenStream.id);
        if (videoStream.stream.id == screenStream.id) {
          console.log(
            "after disconnected  screen: id",
            videoStream.stream.id,
            screenStream.id
          );
        }

        if (videoStream.stream.id !== screenStream.id) {
          return videoStream;
        }
      });
      console.log("After remove the screen share:", prev);
      return prev;
    });

    myScreenStream.current = null;
    srceenSharer.current = null;
    setScreenStreamState(null);
    socketRef.current.emit("screen-share-stopped", {
      roomId: roomId.current,
      screenId: screenStream.id,
    });
  };

  useEffect(() => {
    console.log("screenStreamState updated:", screenStreamState);
  }, [screenStreamState]);

  const getMediaStream = async () => {
    console.log(navigator);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myStream.current = stream;
    return stream;
  };

  const initializeMediaStream = async (userShowName, userId, isHost) => {
    try {
      const tempMyStream = myStream.current;
      console.log("initialize stream:", tempMyStream);
      addVideoStream({
        stream: tempMyStream,
        type: "camera",
        userId: socketRef.current.id,
      });
      console.log("After set stream:", streamState);
      if (roomId.current) {
        socketRef.current.emit(
          "join-room",
          roomId.current,
          socketRef.current.id,
          userShowName,
          userId,
          isHost
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
        myScreenStream,
        user_name,
        key,
        user_id,
        setIsShare,
        isShare,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
