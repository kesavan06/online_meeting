import React, { useRef } from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
import PollCreater from "./PollCreater";

function ChatParticipants({ setShowChatBox, chatView, setChatView ,setIsPoll,isPoll,allMessage,setAllMessage} ) {
  const [viewPoll,setViewPoll] = useState(false);
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
        <FaXmark
          onClick={() => setShowChatBox(false)}
          size={"20px"}
          className="closeChatBox"
        ></FaXmark>
      </div>
      {chatView ? <ChatBox view={view} setView = {setView} setIsPoll={setIsPoll} isPoll={isPoll} allMessage={allMessage} setAllMessage={setAllMessage}></ChatBox> : <Participants view={view} setView = {setView}></Participants>}
    </div>
  );
}

export default ChatParticipants;
