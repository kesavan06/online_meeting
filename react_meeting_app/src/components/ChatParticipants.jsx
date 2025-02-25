import React, { useRef } from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
function ChatParticipants() {
  let [view, setView] = useState(true);
  // let participant = useRef([]);

  return (
      <div className="chatContainer">
        <div className="toggleBox">
          <div className="toggleBtns">
            <button
              className={view ? "activeBtnColor" : "nonActiveBtnColor"}
              onClick={() => {
                setView(true);
              }}
            >
              Chat
            </button>
            <button
              className={view == false ? "activeBtnColor" : "nonActiveBtnColor"}
              onClick={() => {
                setView(false);
              }}
            >
              Participants
            </button>
          </div>
          <FaXmark size={"20px"} className="closeChatBox"></FaXmark>
        </div>
        {view ? <ChatBox view={view} setView = {setView}></ChatBox> : <Participants view={view} setView = {setView} ></Participants>}
      </div>
  );
}

export default ChatParticipants;
