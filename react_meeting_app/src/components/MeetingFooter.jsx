import React, { act, useEffect } from "react";
import { useState } from "react";
import "../MeetingFooter.css";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaB, FaShareFromSquare } from "react-icons/fa6";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FaRightFromBracket } from "react-icons/fa6";
import { FaRegMessage } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaBars } from "react-icons/fa";

function MeetingFooter({ handleBoard, setShowChatBox, chatView, setChatView }) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);

  function handleClick() {
    handleBoard();
  }

  return (
    <div className="footerBox">
      <div className="micVideoConrol">
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
      <div className="meetingControl">
        <div className="controlBox">
          <FaShareFromSquare className="changeColor"></FaShareFromSquare>
        </div>
        <div className="controlBox" onClick={handleClick}>
          <FaChalkboardTeacher className="changeColor"></FaChalkboardTeacher>
        </div>
        <div className="controlBox">
          <FaRegFaceSmile className="changeColor"></FaRegFaceSmile>
        </div>
        <div className="controlBox exitBox">
          <FaRightFromBracket className="exit"></FaRightFromBracket>
        </div>
      </div>
      <div className="moreControls">
        <div
          className="controlBox"
          onClick={() => {
            console.log("Hello");
            setShowChatBox((prev) => (prev = true));
            setChatView((prev) => (prev = true));
          }}
          u
        >
          <FaRegMessage className="changeColor"></FaRegMessage>
        </div>
        <div
          className="controlBox participantBtn"
          onClick={() => {
            console.log("Hello");
            setShowChatBox((prev) => (prev = true));
            setChatView((prev) => (prev = false));
          }}
        >
          <FaUsers className="changeColor"></FaUsers>
          <p>5</p>
        </div>
      </div>
    </div>
  );
}

export default MeetingFooter;
