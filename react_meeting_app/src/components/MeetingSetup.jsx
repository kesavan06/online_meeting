import React, { useEffect, useRef } from "react";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import "../MeetingSetup.css";
import { useState } from "react";
import { useAppContext } from "../Context";

function MeetingSetup({ view, setView }) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const [name, setName] = useState("Kesavan");

  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    console.log("Hello");

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
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
            <button className="createMeeting">Create</button>
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
