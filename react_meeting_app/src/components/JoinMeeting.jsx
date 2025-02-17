import React from "react";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import "../JoinMeeting.css";
import { useState } from "react";

function JoinMeeting({ viewJoinMeeting, setViewJoinMeeting }) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const [name, setName] = useState("Kesavan");

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

          <div className="joinMeetingVideoBox"></div>
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
              <input type="text" placeholder="Enter Room ID"></input>
            </div>
            <div className="joinMeetingBtns">
              <button className="createMeeting">Join</button>
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
