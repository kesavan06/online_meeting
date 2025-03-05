import React, { act, useEffect } from "react";
import { useState } from "react";
import "../MeetingFooter.css";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaB, FaNoteSticky, FaShareFromSquare } from "react-icons/fa6";
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
import { FaUsersRectangle } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import { io } from "socket.io-client";
import { FaRegNoteSticky } from "react-icons/fa6";

function MeetingFooter({
  handleBoard,
  setShowChatBox,
  chatView,
  setChatView,
  startScreenShare,
  isSharing,
  showEmojis,
  setShowEmojis,
  openPopup,
  participantLength,
  setSec,
  sec,
  min,
  setMin,
  isRecord,
  setIsRecord,
  isRun,
  setIsRun,
  breakOutRoom,
  setBreakOutRoom,
  showParticipants,
  setShowParticipants,
  showChatBot,
  setShowChatBot,
  showNotes,
  setShowNotes,

  setShowSignIn,
  setShowSignUp,
  setViewJoinMeeting,
  setViewSetupMeeting,
  setDisplayParent,
  setShowMeeting,
}) {
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  // const [isRecord, setIsRecord] = useState(false);
  const {
    roomId,
    myStream,
    isShare,
    myScreenStream,
    socketRef,
    setPauseAudio,
    setPauseVideo,
    pauseAudio,
    pauseVideo,
    streams,
    setStreamsState,
  } = useAppContext();
  // const [showLeaveMeetingBtn, setShowLeaveMeetingBtn] = useState(false);
  let interval;

  // function handleClick() {
  //   handleBoard();
  // }

  useEffect(() => {
    console.log(pauseAudio, pauseVideo);
    if (pauseAudio) {
      socketRef.current.emit("control-audio", roomId.current);
      console.log("mic off");
    } else {
      socketRef.current.emit("control-audio", roomId.current);
      console.log("mic on");
    }

    socketRef.current.on("control-audio", (roomId, userId) => {
      streams.map((videoStream) => {
        if (videoStream.userId == userId) {
          console.log(videoStream.userId, userId);
          videoStream.stream.getAudioTracks().forEach((track) => {
            track.enabled = !pauseAudio;
          });
        }
      });
    });
  }, [pauseAudio]);

  useEffect(() => {
    if (pauseVideo) {
      socketRef.current.emit("control-video", roomId.current);
      console.log("video off");
    } else {
      socketRef.current.emit("control-video", roomId.current);
      console.log("video on");
    }

    socketRef.current.on("control-video", (roomId, userId) => {
      streams.map((videoStream) => {
        if (videoStream.userId == userId) {
          console.log(videoStream.userId, userId);
          videoStream.stream.getVideoTracks().forEach((track) => {
            track.enabled = !pauseVideo;
          });
        }
      });
    });
  }, [pauseVideo]);
  const leaveMeeting = () => {
    console.log(streams);

    socketRef.current.emit(
      "leave-meeting",
      roomId.current,
      socketRef.current.id
    );
    setShowSignIn((prev) => (prev = false));
    setShowSignUp((prev) => (prev = false));
    setViewJoinMeeting((prev) => (prev = false));
    setViewSetupMeeting((prev) => (prev = false));
    setDisplayParent((prev) => (prev = false));
    setShowMeeting((prev) => (prev = false));
    socketRef.current.disconnect();
    socketRef.current = io("http://localhost:3002");
    setStreamsState((prev) => {
      prev.map((videoStream) => {
        videoStream.stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
      return [];
    });
  };
  socketRef.current.on("leave-meeting", (roomId, userId) => {
    setStreamsState((prev) => {
      prev = prev.filter((videoStream) => {
        if (videoStream.userId != userId) {
          return videoStream;
        } else {
          videoStream.stream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      });
      return prev;
    });
  });
  function startRecording() {
    try {
      let localStream = myStream.current;
      console.log(myScreenStream.current);
      if (myScreenStream.current) {
        localStream = myScreenStream.current;
      } else {
        localStream = myStream.current;
      }
      let stream = startRecord(localStream);
      setIsRun(true);
      // timer();
      if (stream) {
        setIsRecord(true);
      }
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  function stopRecording() {
    try {
      stopRecord();
      console.log("Recording stop!!!");
      stopTimer();
      setIsRecord(false);
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  function handleEmoji() {
    setShowEmojis((prev) => (prev = !prev));
    setBreakOutRoom((prev) => (prev = false));
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

  useEffect(() => {
    if (isRun && !interval) {
      setSec(0);
      interval = setInterval(() => {
        setSec((prev) => prev + 1);
      }, 1000);
    }
  }, [isRun]);

  useEffect(() => {
    if (sec == 59) {
      setMin((prev) => prev + 1);
      setSec(0);
    }
  }, [sec]);

  function stopTimer() {
    clearInterval(interval);
    setIsRun(false);
    setSec(0);
    setMin(0);
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

  useEffect(() => {
    if (isRun && !interval) {
      setSec(0);
      interval = setInterval(() => {
        setSec((prev) => prev + 1);
      }, 1000);
    }
  }, [isRun]);

  useEffect(() => {
    if (sec == 59) {
      setMin((prev) => prev + 1);
      setSec(0);
    }
  }, [sec]);

  function stopTimer() {
    clearInterval(interval);
    setIsRun(false);
    setSec(0);
    setMin(0);
  }

  function showNotebook()
  {
    setShowNotes(true);
    setShowChatBot(false);
    setShowChatBox(false);
    setShowParticipants(false);
    setChatView(false);
  }

  return (
    <div className="footerBox">
      <div className="micVideoConrol">
        <div
          onClick={() => {
            mic ? setMic(false) : setMic(true);
            setPauseAudio((prev) => !prev);
          }}
          className="controlBox"
        >
          {mic ? (
            <FaMicrophone className="changeColor"></FaMicrophone>
          ) : (
            <FaMicrophoneSlash className="changeColor"></FaMicrophoneSlash>
          )}
        </div>
        <div
          onClick={() => {
            video ? setVideo(false) : setVideo(true);
            setPauseVideo((prev) => !prev);
          }}
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

        <div
          className="controlBox"
          onClick={() => {
            startScreenShare();
            openPopup();
          }}
        >
          <FaChalkboardTeacher className="changeColor"></FaChalkboardTeacher>
        </div>

        <div className="controlBox" onClick={() => handleEmoji()} >
          <FaRegFaceSmile className="changeColor"></FaRegFaceSmile>
        </div>
        <div
          className="controlBox"
          onClick={() => {
            setBreakOutRoom((prev) => !prev);
            setShowEmojis((prev) => (prev = false));
          }}
        >
          <FaUsersRectangle
            style={{ width: "40px" }}
            className="changeColor"
          ></FaUsersRectangle>
        </div>
        <div div className="controlBox">
          {!isRecord && (
            <FaRecordVinyl
              className="changeColor"
              onClick={startRecording}
            ></FaRecordVinyl>
          )}
          {isRecord && (
            <FaCircleStop
              className="changeColor"
              onClick={stopRecording}
            ></FaCircleStop>
          )}
        </div>

        <div
          className="controlBox exitBox"
          onClick={() => {
            leaveMeeting();
          }}
        >
          <FaRightFromBracket className="exit"></FaRightFromBracket>
        </div>
      </div>
      <div className="moreControls">
        <div className="controlBox" onClick={showNotebook}>
          <FaRegNoteSticky className="changeColor"></FaRegNoteSticky>
        </div>
        <div
          className="controlBox"
          onClick={() => {
            console.log("Hello");
            setShowChatBox((prev) => (prev = true));
            setChatView((prev) => (prev = true));
            setShowNotes((prev)=>prev=false);
            setShowParticipants((prev) => (prev = false));
            setShowChatBot((prev) => (prev = false));
          }}
        >
          <FaRegMessage className="changeColor"></FaRegMessage>
        </div>
        <div
          className="controlBox participantBtn"
          onClick={() => {
            setShowChatBox((prev) => (prev = true));
            setChatView((prev) => (prev = false));
            setShowParticipants((prev) => (prev = true));
            setShowChatBot((prev) => (prev = false));
          }}
        >
          <FaUsers className="changeColor"></FaUsers>
          <p>{participantLength}</p>
        </div>
        <div
          className="controlBox"
          onClick={() => {
            setShowChatBox((prev) => (prev = true));
            setChatView((prev) => (prev = false));
            setShowParticipants((prev) => (prev = false));
            setShowChatBot((prev) => (prev = true));
          }}
        >
          <FaRobot className="changeColor"></FaRobot>
        </div>
      </div>
    </div>
  );
}

export default MeetingFooter;
