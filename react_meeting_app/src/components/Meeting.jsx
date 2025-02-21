import VideoRecord from "./VideoRecord";
import VideoBox from "./VideoBox";
import ChatParticipants from "./ChatParticipants";
import MeetingFooter from "./MeetingFooter";
import { useState, useEffect, useRef } from "react";

import "../Meeting.css";
import { useAppContext } from "../Context";

const VideoComponent = ({ stream, isLocalStream }) => {
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
      className="video"
      autoPlay
      playsInline
      muted={isLocalStream}
      style={{ cursor: "pointer" }}
    ></video>
  );
};

function Meeting() {
  // let {videoGridRed} = useAppContext();

  const { roomId, streams, myStream, user_name } = useAppContext();

  const [videoElements, setVideoElements] = useState([]);

  useEffect(() => {
    console.log("Current streams:", streams);
  }, [streams]);

  return (
    <div className="meetingContainer">
      <p style={{ color: "white" }}>Room ID:{roomId.current}</p>
      <div className="meetingHeader">
        <VideoRecord></VideoRecord>
      </div>
      <div className="meetingContent">
        <div className="meetingVideoBox">
          {streams.map((stream) => {
            return (
              <VideoComponent
                key={stream.id}
                stream={stream}
                isLocalStream={stream.id === myStream?.current?.id}
              ></VideoComponent>
            );
          })}
        </div>
        <div className="meetingChatParticipants">
          <ChatParticipants></ChatParticipants>
        </div>
      </div>

      <div className="meetingFooter">
        <MeetingFooter></MeetingFooter>
      </div>
      <></>
    </div>
  );
}

export default Meeting;
