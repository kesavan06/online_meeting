import React, { useRef } from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
function ChatParticipants({ setShowChatBox, chatView, setChatView }) {
  let [view, setView] = useState(true);


  return (
    <div className="chatContainer">
    <div className="toggleBox">
      <div className="toggleBtns">
        <button
          className={chatView ? "activeBtnColor" : "nonActiveBtnColor"}
          onClick={() => {
            setChatView(true);
          }}
        >
          Chat
        </button>
        <button
          className={
            chatView == false ? "activeBtnColor" : "nonActiveBtnColor"
          }
          onClick={() => {
            setChatView(false);
          }}
        >
          Participants
        </button>
      </div>
      <FaXmark onClick={() => setShowChatBox(false)} size={"20px"}  className="closeChatBox"></FaXmark>

    </div>
    {chatView ? <ChatBox view={view} setView = {setView}></ChatBox> : <Participants  view={view} setView = {setView}></Participants>}
  </div>
  );
}

export default ChatParticipants;
