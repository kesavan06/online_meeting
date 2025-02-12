import React, { act } from "react";
import { useState } from "react";
import "../Footer.css";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

function Footer() {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  return (
    <>
      <div className="footerBox">
        <div className="micVideoConrol">
          <div
            onClick={() => (mic ? setMic(false) : setMic(true))}
            className="controlBox"
          >
            {mic ? (
              <FaMicrophone className="microPhone"></FaMicrophone>
            ) : (
              <FaMicrophoneSlash className="microPhone"></FaMicrophoneSlash>
            )}
          </div>
          <div
            onClick={() => (video ? setVideo(false) : setVideo(true))}
            className="controlBox"
          >
            {video ? (
              <FaVideo className="microPhone"></FaVideo>
            ) : (
              <FaVideoSlash className="microPhone"></FaVideoSlash>
            )}
          </div>
        </div>
        <div className="meetingControl"></div>
        <div className="moreControls"></div>
      </div>
    </>
  );
}

export default Footer;
