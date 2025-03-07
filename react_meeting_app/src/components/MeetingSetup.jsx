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
  const {
    roomId,
    socketRef,
    initializeMediaStream,
    user_name,
    host,
    user_id,
    getMediaStream,
  } = useAppContext();
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  // const [name, setName] = useState("Kesavan");

  const userName = useRef(null);

  useEffect(() => {
    console.log("U in current : ", user_name.current);
    if (userName.current) {
      userName.current.value = user_name.current; // Set input value manually
    }
  }, [user_name]);

  const localStream = useRef(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        localStream.current = await getMediaStream();
        if (videoRef.current) {
          videoRef.current.srcObject = localStream.current;
        }
        console.log(videoRef.current);
      } catch (err) {
        console.log("Error accessing media devices:", err);
      }
    };
    startStream();
  }, []);

  const stopStream = async () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
      setView(!view);

      if (videoRef) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const createRoomClicked = () => {
    console.log("UserName : ", userName.current.value);
    user_name.current = userName.current.value;
    console.log("UserName IN change : ", user_name.current);

    // console.log("User name after changing : ",user_name);

    const newRoomId = Math.random().toString(36).substring(2, 9);
    roomId.current = newRoomId;
    setView(!view);
    console.log("Create room");
    socketRef.current.emit("create-room", roomId.current);
  };

  socketRef.current.on("room-created", (newRoomId) => {
    console.log(`Room created: ${newRoomId}`);

    setShowMeeting(!showMeeting);
    initializeMediaStream(user_name.current, user_id.current, true);
    console.log(showMeeting);
  });

  // async function cMeetingFetch() {
  //   let create = await fetch("https://10.89.72.171:3002/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ room_name : roomId.current, user_name : user.current, isHost: true,user_id: user_id.current }),
  //   })

  //   let res= await create.json();
  //   console.log("Create : ",res);

  // }

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
            <video muted ref={videoRef} autoPlay playsInline />
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
            <input type="text" placeholder="Enter your name" ref={userName} />
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
