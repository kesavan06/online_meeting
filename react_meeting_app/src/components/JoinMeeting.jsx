import React from "react";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import "../JoinMeeting.css";
import { useState, useRef, useEffect } from "react";

function JoinMeeting({
  viewJoinMeeting,
  setViewJoinMeeting,
  view,
  setView,
  showMeeting,
  setRoomId,
  setShowMeeting,
}) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const [name, setName] = useState("Kesavan");
  const [roomInput, setRoomInput] = useState("");

  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        console.log(mediaStream);

        setStream(mediaStream);
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
      stream.getTracks().forEach((track) => track.stop());
      console.log(stream);
      setStream(null);
      setView(!view);

      if (videoRef) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const joinRoom = () => {
    if (roomInput.trim() !== "") {
      setRoomId(roomInput);
      setView(!view);
    } else {
      alert("Please enter a valid Room ID");
    }
  };
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
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
              ></input>
            </div>
            <div className="joinMeetingBtns">
              <button className="createMeeting" onClick={joinRoom}>
                Join
              </button>
              <button
                onClick={() => {
                  setViewJoinMeeting(!viewJoinMeeting);
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
