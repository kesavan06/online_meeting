import VideoRecord from "./VideoRecord";
import VideoBox from "./VideoBox";
import ChatParticipants from "./ChatParticipants";
import MeetingFooter from "./MeetingFooter";
import { useState, useEffect, useRef } from "react";
import WhiteBoard from "./WhiteBoard";

import "../Meeting.css";
import { useAppContext } from "../Context";

const VideoComponent = ({ stream, isLocalStream, showWhiteBoard }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log("Setting stream to video element:", stream.id);
      videoRef.current.srcObject = stream;

      videoRef.current.onloadmetadata = () => {
        video.current.play().catch((err) => {
          console.log("Error playing video: ", err);
        });
      };
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={!showWhiteBoard ? "video" : "upVideo"}
      autoPlay
      playsInline
      muted={isLocalStream}
      style={{ cursor: "pointer" }}
      disablePictureInPicture
    ></video>
  );
};

function Meeting() {
  // let {videoGridRed} = useAppContext();

  const [showWhiteBoard, setShowWhiteBoard] = useState(false);
  const [showChatBox, setShowChatBox] = useState(true);
  let [chatView, setChatView] = useState(true);

  const { roomId, streams, myStream } = useAppContext();

  function handleWhiteBoardShow() {
    setShowWhiteBoard(!showWhiteBoard);
  }

  useEffect(() => {
    console.log("Current streams:", streams);
  }, [streams]);

  return (
    <div className="meetingContainer">
      <div className="meetingHeaderBox">
        <div className="meetingHeader">
          <VideoRecord></VideoRecord>
          <p style={{ color: "white" }}>Meeting ID: {roomId.current}</p>
        </div>
      </div>
      <div className="meetingContent">
        <div className= {showChatBox ? "meetingVideoBox" : "meetingVideoBox1"}>
          <div className="videoBoxes">
            {streams.map((stream) => {
              return (
                <VideoComponent
                  key={stream.id}
                  stream={stream}
                  isLocalStream={stream.id === myStream?.current?.id}
                  showWhiteBoard={showWhiteBoard}
                ></VideoComponent>
              );
            })}
          </div>
          <div className="whiteBoardBox">
            {showWhiteBoard && (
              <WhiteBoard controlBoard={handleWhiteBoardShow} />
            )}
          </div>
        </div>
        {showChatBox && (
          <div className="meetingChatParticipants">
            <ChatParticipants
              setShowChatBox={setShowChatBox}
              chatView={chatView}
              setChatView={setChatView}
            ></ChatParticipants>
          </div>
        )}
      </div>
      <div className="meetingFooter">
        <MeetingFooter
          setShowChatBox={setShowChatBox}
          handleBoard={handleWhiteBoardShow}
          chatView={chatView}
          setChatView={setChatView}
        ></MeetingFooter>
      </div>
    </div>
  );
}

export default Meeting;
