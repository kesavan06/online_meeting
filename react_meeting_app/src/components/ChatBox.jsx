import React, { useEffect, useState, useRef } from "react";
import { FaUsers } from "react-icons/fa";
import { FaFaceSmile } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import "../ChatBox.css";
import ShowMessage from "./ShowMessages";
import { useAppContext } from "../Context";
import Emoji from "./Emoji";
import Wrapper from "./Wrapper";
import PollCreater from "./PollCreater";
import ShowOptions from "./ShowOptions";
// import EmojiPicker from 'emoji-picker-react';

function ChatBox({ view, setView, isPoll, setIsPoll, allMessage, setAllMessage, allParticipants, isPrivate  }) {
  let { user_name, socketRef, roomId , toSocket} = useAppContext();
  // let [allMessage, setAllMessage] = useState([]);

  const chatMessageRef = useRef(null);

  const scrollToBottom = () => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [allMessage]);

  let messageRef = useRef("");

  const [showEmoji, setShowEmoji] = useState(false);
  let [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(!open);
  }

  function handleSendMessage() {
    let newM;
    let messageText = messageRef.current.value;
    messageText = messageText.trim();

    const today = new Date();

    let getTodayTime = today.toLocaleTimeString();
    let splitDay = getTodayTime.split(":");


    let day = (+splitDay[0] > 12) ? +splitDay[0] - 12 + "." + splitDay[1] + " PM" : splitDay[0] + "." + splitDay[1] + " AM";

    if (splitDay[0] == 12) {
      day = splitDay[0] + "." + splitDay[1] + " PM";
    }

    console.log("Is A private message : ", isPrivate);

    if (messageText != "") {

      newM = {
        user_name: user_name.current,
        message: messageText,
        sender_id: socketRef.current.id,
        room_id: roomId.current,
        time: day,
        isPrivate: isPrivate.current,
        type: "msg"
      };

      if (isPrivate.current == true) {
        newM.receiver_id = toSocket.current;
      }

     console.log("Is A private message 2 : ", newM);


      socketRef.current.emit("sendMessage", newM);
      messageRef.current.value = "";

    }
  }

  function checkTheEmojiClicked(msg) {
    messageRef.current.value += msg;
  }

  function handlekeyDown(e) {

    if (e.key == "Enter") {
      if (messageRef.current.value != "") {
        handleSendMessage();
      }
    }
  }

  function handleShowEmoji() {
    setShowEmoji(!showEmoji);
    handleOpen();
  }

  useEffect(() => {
    setTimeout(async () => {
      let fetchAllMessages = await fetch("http://localhost:3002/allMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomId.current }),
      });
      setAllMessage([]);


      let allM = await fetchAllMessages.json();
      let message;

      // console.log("All mess  - Public : ", allM.data);

      let allMNow = [];
      for (let m of allM.data) {
        if (m.sender_id == socketRef.current.id && m.isPrivate && m.receiver_id !== undefined) {
          // console.log(1);
          allMNow.push(m);
        }
        if (m.receiver_id == socketRef.current.id && m.isPrivate) {
          // console.log(2);
          allMNow.push(m);
        }
        if (!m.isPrivate && m.receiver_id == undefined) {
          // console.log(3);
          allMNow.push(m)
        }
      }

      console.log("All grouped messages : ", allMNow);

      message = allMNow

      for (let mess of message) {
        let isMine = false;
        if (mess.sender_id == socketRef.current.id) {
          isMine = true;
        }
        mess.isMine = isMine;

        setAllMessage((prev) => [...prev, mess]);
      }
    }, 100)
  }, [view])


  const handleNewMessage = (msg) => {
    // console.log("MSG TYPE: ", msg.type);

    if (msg.type == "vote1") {
      for (let chat of allMessage) {
        if (chat.type == "poll" && chat.message.index == msg.index) {
          chat.message.answer1 += 1;
          chat.message.totalVote += 1;
        }
      }
    }
    else if (msg.type == "vote2") {
      for (let pollMsg of allMessage) {
        if (pollMsg.type == "poll" && pollMsg.message.index == msg.index) {
          pollMsg.message.answer2 += 1;
          pollMsg.message.totalVote += 1;
        }
      }
    }
   
    let isMyMessage = false;
    let { user_name, message, sender_id, time, type, isPrivate } = msg;
    let msgGot = { user_name, message, time, type, isPrivate };


    if (socketRef.current.id == sender_id) {
      isMyMessage = true;
    }

    let sendClass = isMyMessage;
    // console.log("Message is mine : ", isMyMessage);

    setAllMessage((exsistingMessages) => [
      ...exsistingMessages,
      { ...msgGot, isMine: sendClass },
    ]);

    // }
  };

  
  useEffect(() => {

    socketRef.current.off("receivedMessage");

    socketRef.current.on("receivedMessage", (msg) => {
      console.log("Message received from server ", msg);
      handleNewMessage(msg);
    });

  }, [allMessage]);

  return (
    <div className="chatBox">
      <div className="chatDisplay">
        <ShowMessage newMessages={allMessage} />
        <div ref={chatMessageRef} />
      </div>

      <div className="sentBox">
        <div className="msgPermision">
          <p>To</p>

          <ShowOptions parArray={allParticipants} isPrivate={isPrivate} ></ShowOptions>

          {showEmoji && (
            <Emoji
              emojiHandle={checkTheEmojiClicked}
              handleOpen={handleOpen}
              handleShowEmoji={handleShowEmoji}
            />
          )}
          <button onClick={() => setIsPoll(true)}>Poll</button>

      
        </div>

        <div className="sentInputBox">
          <input
            type="text"
            placeholder="Enter your message..."
            ref={messageRef}
            onKeyDown={handlekeyDown}
          ></input>

          <button onClick={(msg) => handleShowEmoji(msg)}>
            <FaFaceSmile className="invert"></FaFaceSmile>
          </button>

          <button onClick={() => handleSendMessage()}>
            <FaPaperPlane className="invert"></FaPaperPlane>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
