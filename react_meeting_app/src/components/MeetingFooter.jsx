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
import { FaCircleStop } from "react-icons/fa6";
import { useAppContext } from "../Context";
import { stopRecord } from "../Recording";
import { startRecord } from "../Recording";
import { FaRecordVinyl } from "react-icons/fa";

function MeetingFooter({
  handleBoard,
  setShowChatBox,
  chatView,
  setChatView,
  startScreenShare,
  isSharing,
  showEmojis,
  setShowEmojis,
  setSec,
  sec,
  min,
  setMin,
  isRecord,
  setIsRecord
}) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const { myStream, isShare, myScreenStream,socketRef } = useAppContext();
  let interval;
  const [isRun,setIsRun] = useState(false);
  

  function handleClick() {
    handleBoard();
  }

  // function shareScreen() {
  //   setIsShare(true);
  // }

  function startRecording() {
    try {
      let localStream;
      console.log(myScreenStream.current);
      if (myScreenStream.current) {
        localStream = myScreenStream.current;
      }
      else{
        localStream = myStream.current
      }
      let stream = startRecord(localStream);
      setIsRun(true);
      // timer();
      if (stream) {
        setIsRecord(true);
      }
    }
    catch (err) {
      console.log("Error: " + err);
    }

  }


  function stopRecording() {
    try {
      stopRecord();
      console.log("Recording stop!!!");
      stopTimer();
      setIsRecord(false);
    }
    catch (err) {
      console.log("Error: " + err);
    }
  }

  function handleEmoji(){
    setShowEmojis((prev)=> prev=!prev)
  }

  // function timer()
  // {
    // if(isRun)
    // {
    //   interval = setInterval(()=>{
    //     setSec((prev)=>prev+1);

    //   },1000);
    // }

  // }

useEffect(()=>{
  if(isRun && !interval)
  {
    setSec(0);
    interval = setInterval(() => {
      setSec((prev) => prev + 1);

    }, 1000);
  }
},[isRun])

  useEffect(()=>{
    if(sec==59)
    {
      setMin((prev)=>prev+1);
      setSec(0);
    }
  },[sec])

  function stopTimer()
  {
    clearInterval(interval);
    setIsRun(false);
    setSec(0);
    setMin(0);
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
        <div
          className="controlBox"
          onClick={() => {
            startScreenShare();
          }}
        >
          <FaShareFromSquare className="changeColor"></FaShareFromSquare>
        </div>
        <div className="controlBox" onClick={handleClick}>
          <FaChalkboardTeacher className="changeColor"></FaChalkboardTeacher>
        </div>
        <div className="controlBox" onClick={()=>handleEmoji()}>
          <FaRegFaceSmile className="changeColor" ></FaRegFaceSmile>
        </div>
        <div>
          {!isRecord && <FaRecordVinyl className="changeColor" onClick={startRecording}></FaRecordVinyl>}
          {isRecord && <FaCircleStop className="changeColor" onClick={stopRecording}></FaCircleStop>}
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
