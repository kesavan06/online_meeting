import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
import PollCreater from "./PollCreater";
import { useAppContext } from "../Context";

function ChatParticipants({ setShowChatBox, chatView, setChatView, setIsPoll, isPoll, allMessage, setAllMessage, setParticipantLength, showMeeting, isPrivate, allParticipants, setAllParticipants }) {
  const [viewPoll, setViewPoll] = useState(false);

  let [view, setView] = useState(true);
  const { roomId, toSocket, socketRef } = useAppContext();


  useEffect(() => {
    setTimeout(async () => {

      await getParticipants(roomId.current, socketRef);

    }, 100);

  }, [])


  async function getParticipants(roomId) {
    try {
      // console.log("Inside emit function ------------------------------------------------------------------------- ");
      socketRef.current.emit("getParticiapants", (roomId));


      await socketRef.current.on("giveParticicpant", (msg) => {

        setAllParticipants([]);

        setParticipantLength(prev => prev = msg.length);

        for (let p of msg) {
          let name = p.name;
          let socketId = p.socketId;
          let host = p.isHost;

          setAllParticipants((prev) => [...prev, { name, socketId, host }]);
        }
      })


    }
    catch (err) {
      console.log("Error : \n", err);
    }
  }



  useEffect(() => {
    console.log("Message to : ", toSocket);
  }, [toSocket.current]);


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
      {chatView ? <ChatBox view={view} setView={setView} setIsPoll={setIsPoll} isPoll={isPoll} allParticipants={allParticipants} allMessage={allMessage} setAllMessage={setAllMessage} isPrivate={isPrivate}></ChatBox> : <Participants view={view} setParticipantLength={setParticipantLength} allParticipants={allParticipants} setAllParticipants={setAllParticipants} isPrivate={isPrivate}></Participants>}
    </div>
  );
}

export default ChatParticipants;







