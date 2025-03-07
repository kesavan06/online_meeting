import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import "../ChatParticipants.css";
import ChatBox from "./ChatBox";
import Participants from "./Participants";
import PollCreater from "./PollCreater";
import { ChatBot } from "./ChatBot";
import { useAppContext } from "../Context";

function ChatParticipants({
  setShowChatBox,
  chatView,
  setChatView,
  setIsPoll,
  isPoll,
  allMessage,
  setAllMessage,
  setParticipantLength,
  showMeeting,
  showChatBot,
  setShowChatBot,
  showParticipants,
  setShowParticipants,
  chatBotMessage,
  setChatBotMessage,
  isPrivate,
  allParticipants,
  setAllParticipants,
}) {
  const [viewPoll, setViewPoll] = useState(false);


  function saveChat(userId) {

    console.log("Chat mess : ", allMessage);
    console.log("User id : ", userId);


    if (allMessage.length !== 0) {

      const chatMessages = allMessage.map((message) => {
        if (message.isPrivate) {
          return `${message.user_name}: ${message.message} (private)`
        }
        else {
          return `${message.user_name}: ${message.message}`
        }
      }).join("\n");


      console.log("Chat Message : ", chatMessages);

      const data = new Blob([chatMessages], { type: "text/plain " });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(data);
      link.download = "chat_message.txt";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }



  let [view, setView] = useState(true);
  const { roomId, toSocket, socketRef } = useAppContext();

  useEffect(() => {
    setTimeout(async () => {
      await getParticipants(roomId.current, socketRef);
    }, 100);
  }, []);

  async function getParticipants(roomId) {
    try {
      // console.log("Inside emit function ------------------------------------------------------------------------- ");
      socketRef.current.emit("getParticiapants", roomId);

      await socketRef.current.on("giveParticicpant", (msg) => {
        setAllParticipants([]);

        setParticipantLength((prev) => (prev = msg.length));

        for (let p of msg) {
          let name = p.name;
          let socketId = p.socketId;
          let host = p.isHost;

          setAllParticipants((prev) => [...prev, { name, socketId, host }]);
        }
      });
    } catch (err) {
      console.log("Error : \n", err);
    }
  }

  useEffect(() => {
    console.log("Chat bot message : ", chatBotMessage);
  }, []);

  return (
    <div className="chatContainer">
      <div className="toggleBox">
        <div className="toggleBtns">
          <button
            className={chatView ? "activeBtnColor" : "nonActiveBtnColor"}
            onClick={() => {
              setChatView((prev) => (prev = true));
              setShowParticipants((prev) => (prev = false));
              setShowChatBot((prev) => (prev = false));
            }}
          >
            Chat
          </button>
          <button
            className={
              showParticipants ? "activeBtnColor" : "nonActiveBtnColor"
            }
            onClick={() => {
              setChatView((prev) => (prev = false));
              setShowParticipants((prev) => (prev = true));
              setShowChatBot((prev) => (prev = false));
            }}
          >
            Participants
          </button>
          <button
            className={showChatBot ? "activeBtnColor" : "nonActiveBtnColor"}
            onClick={() => {
              setChatView((prev) => (prev = false));
              setShowParticipants((prev) => (prev = false));
              setShowChatBot((prev) => (prev = true));
            }}
          >
            ChatBot
          </button>
        </div>
        <FaXmark
          onClick={() => setShowChatBox(false)}
          size={"20px"}
          className="closeChatBox"
        ></FaXmark>
      </div>
      {chatView ? (
        <ChatBox
          view={view}
          setView={setView}
          setIsPoll={setIsPoll}
          isPoll={isPoll}
          allMessage={allMessage}
          setAllMessage={setAllMessage}
          allParticipants={allParticipants}
          isPrivate={isPrivate}
          saveChat={saveChat}
        ></ChatBox>
      ) : showChatBot ? (
        <ChatBot
          chatBotMessage={chatBotMessage}
          setChatBotMessage={setChatBotMessage}
        ></ChatBot>
      ) : (
        <Participants
          view={view}
          setView={setView}
          setParticipantLength={setParticipantLength}
          getPaticipants={getPaticipants}
          allParticipants={allParticipants}
          setAllParticipants={setAllParticipants}
        ></Participants>
      )}
    </div>
  );
}

export default ChatParticipants;

async function getPaticipants(roomId) {
  try {
    let fetchP = await fetch("https://10.89.72.171:3002/getP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId: roomId }),
    });

    console.log("Fetch : ", fetchP);

    let par = await fetchP.json();
    console.log(par);
    console.log("Length : ", par.data.length);

    console.log("Length set ------");

    // setParticipantLength(prev => prev=par.data.length);
    if (par != null) {
      console.log("Paticicpants : ", par);
    } else {
      console.log("Error : ", par);
    }
    return par;
  } catch (err) {
    console.log("Error : \n", err);
  }
}
