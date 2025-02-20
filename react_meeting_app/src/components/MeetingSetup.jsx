import React, { useEffect, useRef } from "react";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import "../MeetingSetup.css";
import { useState } from "react";
import { useAppContext } from "../Context";
// import { useSocketEvents } from "../socket";

function MeetingSetup({ view, setView, showMeeting, setShowMeeting }) {
  const { roomId, socketRef, initializeMediaStream,user_name } =
    useAppContext();
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  // const [name, setName] = useState("Kesavan");

  let userName = useRef();

  const localStream = useRef(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        console.log(mediaStream);

        localStream.current = mediaStream;
        console.log("Stream:", localStream.current);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    startStream();
  }, []);

  const stopStream = async () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      console.log(stream);
      localStream.current = null;
      setView(!view);

      if (videoRef) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const createRoomClicked = () => {
    
    user_name.current = userName.current.value; 


    const newRoomId = Math.random().toString(36).substring(2, 9);
    roomId.current = newRoomId;
    setView(!view);
    console.log("Create room");
    socketRef.current.emit("create-room", roomId.current);
  };

  socketRef.current.on("room-created", (newRoomId) => {
    console.log(`Room created: ${newRoomId}`);
    
    setShowMeeting(!showMeeting);
    initializeMediaStream();
  });

  return (
    <div className="popupContainer">
      <div className="setupContainer">
        <div className="setupBox">
          <div className="setupHeading">
            <h1>Get Started</h1>
            <p>Prepare your audio and video setup before connecting</p>
          </div>
          <div className="infoBtns">
            <button className="liveBtn">
              <span className="liveDot"></span>LIVE
            </button>
            {/* <button className="participentsBtn">18 others Participants</button> */}
          </div>

          <div className="setupVideoBox">
            <video ref={videoRef} autoPlay playsInline />
          </div>
          <div className="setupVideoControls">
            <div
              onClick={() => (mic ? setMic(false) : setMic(true))}
              className="controlBox"
            >
              {mic ? (
                <FaMicrophone className="changeColor"></FaMicrophone>
              ) : (
                <FaMicrophoneSlash className="changeColor"></FaMicrophoneSlash>
              )}
            </div>
            <div
              onClick={() => (video ? setVideo(false) : setVideo(true))}
              className="controlBox"
            >
              {video ? (
                <FaVideo className="changeColor"></FaVideo>
              ) : (
                <FaVideoSlash className="changeColor"></FaVideoSlash>
              )}
            </div>
          </div>
          <div className="setupUser">
            <input
              type="text"
              placeholder="Enter your name"
              ref={userName}
            />
            <button
              className="createMeeting"
              onClick={() => {
                createRoomClicked();
              }}
            >
              Create
            </button>
            <button onClick={stopStream} className="cancelMeeting">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingSetup;
