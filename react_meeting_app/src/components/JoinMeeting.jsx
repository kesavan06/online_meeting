import React from "react";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import "../JoinMeeting.css";
import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../Context";

function JoinMeeting({
  viewJoinMeeting,
  setViewJoinMeeting,
  showMeeting,
  setShowMeeting,
}) {
  const { roomId, socketRef, initializeMediaStream , user_name} = useAppContext();

  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  // const [name, setName] = useState("Kesavan");
  // const [roomInput, setRoomInput] = useState("");

  const userName = useRef(null);
  const roomInput = useRef(null);

  const stream = useRef(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        console.log(mediaStream);

        stream.current = mediaStream;
        console.log("Stream:", stream);

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
    if (stream) {
      stream.current.getTracks().forEach((track) => track.stop());
      console.log(stream);
      stream.current = null;
      setViewJoinMeeting(!viewJoinMeeting);

      if (videoRef) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const joinRoom = () => {
    console.log("User: ",userName.current.value);
    console.log("Room: ",roomInput.current.value);

    if (roomInput.current.value.trim() !== "") {
   
      user_name.current = userName.current.value;
      roomId.current = roomInput.current.value;

      setShowMeeting(!showMeeting);
      console.log("joinRoom: ", roomId.current);
      setViewJoinMeeting(!viewJoinMeeting);

      socketRef.current.emit("join-existing-room", roomId.current);
    } else {
      alert("Please enter a valid Room ID");
    }
  };

  socketRef.current.on("room-exists", (res) => {
    console.log(`Room exists check: ${res.exists}`);
    if (res.exists) {
      initializeMediaStream(user_name.current);
    } else {
      alert("Room does not exist!");
    }
  });

  return (
    <div className="popupContainer">
      <div className="joinMeetingContainer">
        <div className="joinMeetingBox">
          <div className="joinMeetingHeader">
            <h1>Get Started</h1>
            <p>Prepare your audio and video setup before connecting</p>
          </div>
          <div className="joinInfoBtns">
            <button className="joinLiveBtn">
              <span className="liveDot"></span>LIVE
            </button>
            {/* <button className="participentsBtn">18 others Participants</button> */}
          </div>

          <div className="joinMeetingVideoBox">
            <video ref={videoRef} autoPlay playsInline />
          </div>
          <div className="joinMeetingControls">
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
          <div className="joinMeetingUser">
            <div className="joinMeetingInputs">
              <input
                type="text"
                placeholder="Enter your name"
                ref={userName}
              />
              <input
                type="text"
                placeholder="Enter Room ID"
                ref={roomInput}
              ></input>
            </div>
            <div className="joinMeetingBtns">
              <button className="createMeeting" onClick={joinRoom}>
                Join
              </button>
              <button
                onClick={() => {
                  stopStream();
                }}
                className="cancelMeeting"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
