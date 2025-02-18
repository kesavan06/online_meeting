import VideoRecord from "./VideoRecord";
import VideoBox from "./VideoBox";
import ChatParticipants from "./ChatParticipants";
import MeetingFooter from "./MeetingFooter";
import { useState } from "react";

import "../Meeting.css";

function Meeting({ viewMeeting }) {
  // let {videoGridRed} = useAppContext();

  return (
    <div className="meetingContainer">
      <div className="meetingHeader">
        <VideoRecord></VideoRecord>
      </div>
      <div className="meetingContent">
        <div className="meetingVideoBox">
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
          <VideoBox></VideoBox>
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
