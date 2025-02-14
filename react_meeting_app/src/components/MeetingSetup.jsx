import React from "react";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import "../MeetingSetup.css";
import { useState } from "react";

function MeetingSetup({ view, setView }) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const [name, setName] = useState("Kesavan");

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

          <div className="setupVideoBox"></div>
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
            <button
              onClick={() => {
                setView(!view);
              }}
              className="cancelMeeting"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingSetup;
