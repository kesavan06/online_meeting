import React from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
import PollCreater from "./PollCreater";

function ChatParticipants({ setShowChatBox, chatView, setChatView }) {
  const [viewPoll,setViewPoll] = useState(false);

  return (
    <div className="chatContainer">
      <div className="toggleBox">
        <div className="toggleBtns">
          <button
            className={chatView ? "activeBtnColor" : "nonActiveBtnColor"}
            onClick={() => {
              setChatView(true);
              setViewPoll(false);
            }}
          >
            Chat
          </button>
          <button
            className={
              !chatView && !viewPoll ? "activeBtnColor" : "nonActiveBtnColor"
            }
            onClick={() => {
              setChatView(false);
              setViewPoll(false);
            }}
          >
            Participants
          </button>
          <button className={viewPoll ? "activeBtnColor" : "nonActiveBtnColor"} onClick={()=>{
            setViewPoll(true);
            setChatView(false);
          }}>
            Poll
          </button>
        </div>
        <FaXmark
          onClick={() => setShowChatBox(false)}
          size={"20px"}
          className="closeChatBox"
        ></FaXmark>
      </div>
      {chatView ? <ChatBox></ChatBox> : !chatView && viewPoll ? <PollCreater></PollCreater> : <Participants></Participants>}
    </div>
  );
}

export default ChatParticipants;
