import VideoRecord from "./VideoRecord";
import VideoBox from "./VideoBox";
import ChatParticipants from "./ChatParticipants";
import MeetingFooter from "./MeetingFooter";
import { useState, useEffect } from "react";

import "../Meeting.css";
import { useAppContext } from "../Context";

function Meeting() {
  // let {videoGridRed} = useAppContext();

  const { roomId, streams,user_name } = useAppContext();
  console.log("User name: ",user_name);

  // const [videoElements, setVideoElements] = useState([]);

  // useEffect(() => {
  //   console.log("Hello");
  //   console.log(streams.current);

  //   setVideoElements(streams.current);
  // }, []);

  return (
    <div className="meetingContainer">
      <p style={{ color: "white" }}>Room ID:{roomId.current}</p>
      <div className="meetingHeader">
        <VideoRecord></VideoRecord>
      </div>
      <div className="meetingContent">
        <div className="meetingVideoBox">
          {streams.current.map((stream, index) => {
            console.log(stream);
            return (
              <video
                className="video"
                key={index}
                autoPlay={true}
                // playsInline // Required for mobile browsers
                ref={(videoElement) => {
                  if (videoElement) {
                    videoElement.srcObject = stream; // Assign the MediaStream to srcObject
                  }
                }}
              />
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
