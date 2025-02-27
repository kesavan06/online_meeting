import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
import PollCreater from "./PollCreater";
import { useAppContext } from "../Context";

function ChatParticipants({ setShowChatBox, chatView, setChatView, setIsPoll, isPoll, allMessage, setAllMessage, setParticiapantLength,showMeeting }) {
  const [viewPoll, setViewPoll] = useState(false);
  let [view, setView] = useState(true);
  const { roomId } = useAppContext();

  useEffect(() => {

    setTimeout(async() => {
      console.log("ROom id : ", roomId);
      let part = await getPaticipants(roomId.current);
      console.log("Room participant : ", part);
      setParticiapantLength((prev) => prev = part.data.length);
    },50)

  }, [showMeeting])

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
      {chatView ? <ChatBox view={view} setView={setView} setIsPoll={setIsPoll} isPoll={isPoll} allMessage={allMessage} setAllMessage={setAllMessage}></ChatBox> : <Participants view={view} setView={setView} setParticipantLength={setParticiapantLength} getPaticipants={getPaticipants}></Participants>}
    </div>
  );
}

export default ChatParticipants;



async function getPaticipants(roomId) {
  try {
    let fetchP = await fetch("http://localhost:3002/getP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ roomId: roomId })
    })

    console.log("Fetch : ", fetchP);


    let par = await fetchP.json();
    console.log(par);
    console.log("Length : ", par.data.length);

    console.log("Length set ------");


    // setParticipantLength(prev => prev=par.data.length);
    if (par != null) {
      console.log("Paticicpants : ", par);
    }
    else {
      console.log("Error : ", par);
    }
    return par;
  }
  catch (err) {
    console.log("Error : \n", err);
  }
}