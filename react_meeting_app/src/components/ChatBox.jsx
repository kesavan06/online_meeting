import React, { useEffect, useState, useRef } from "react";
import { FaUsers } from "react-icons/fa";
import { FaFaceSmile } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import "../ChatBox.css";
import ShowMessage from "./ShowMessages";
import { useAppContext } from "../Context";
import Emoji from "./Emoji";
import EmojiPicker from 'emoji-picker-react';



function ChatBox() {

  let { user_name, socketRef, roomId } = useAppContext();

  let [allMessage, setAllMessage] = useState([]);

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
    console.log(today.toLocaleString());

    let getTodayTime = today.toLocaleTimeString();
    let splitDay = getTodayTime.split(":");

    let day = (+splitDay[0]) > 12 ? (+splitDay[0]) - 12 + "." + splitDay[1] + " PM" : splitDay[0] + "." + splitDay[1] + " AM";
    if (splitDay[0] == 12) {
      day = splitDay[0] + "." + splitDay[1] + " PM";
    }

    if (messageText != "") {

      console.log("Room : ", roomId.current);
      console.log("Message : ", messageRef.current);

      newM = {
        user_name: user_name.current,
        message: messageText,
        sender_id: socketRef.current.id,
        room_id: roomId.current,
        time: day,
      }

      socketRef.current.emit("sendMessage", (newM));
      messageRef.current.value = "";


    }

  }



  function checkTheEmojiClicked(msg) {
    messageRef.current.value += msg;
  }

  function handlekeyDown(e) {
    console.log(e.key);
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

  //   const handleNewMessage = (msg) => {


  //     let isMyMessage = false;

  //     let { user_name, message, sender_id, time } = msg;
  //     let msgGot = { user_name, message,time };

  //     if (socketRef.current.id == sender_id) {
  //         isMyMessage = true;
  //     }

  //     let sendClass = isMyMessage;
  //     console.log("Message is mine : ",isMyMessage);

  //     setAllMessage((exsistingMessages) => [...(exsistingMessages), { ...msgGot, isMine: sendClass }]);

  // }


  const handleNewMessage = (allMess) => {

    // setAllMessage("")
    for (let msg of allMess) {
      let isMyMessage = false;

      let { user_name, message, sender_id, time } = msg;
      let msgGot = { user_name, message, time };

      if (socketRef.current.id == sender_id) {
        isMyMessage = true;
      }

      let sendClass = isMyMessage;
      console.log("Message is mine : ", isMyMessage);

      setAllMessage((exsistingMessages) => [...(exsistingMessages), { ...msgGot, isMine: sendClass }]);
    }

  }

  useEffect(() => {
    handleSendMessage

    socketRef.current.off("receivedMessage");

    socketRef.current.on("receivedMessage", (msg) => {
      console.log("Message received: ");
      handleNewMessage(msg);

    });
  }, [allMessage]);

  return (
    <div className="chatBox">

      <div className="chatDisplay">
        <ShowMessage newMessages={allMessage} />
      </div>

      <div className="sentBox">

        <div className="msgPermision">
          <p>To</p>
          <select className="selectUser">
            <option>Everyone</option>
            <option>Kesavan</option>
            <option>Hari</option>
          </select>

          {showEmoji && <Emoji emojiHandle={checkTheEmojiClicked} handleOpen={handleOpen}/>}

        </div>

        <div className="sentInputBox">
          <input type="text" placeholder="Enter your message..." ref={messageRef} onKeyDown={handlekeyDown}></input>

          <button onClick={handleShowEmoji}>
            <FaFaceSmile className="invert" ></FaFaceSmile>
          </button>

          <button onClick={handleSendMessage}>
            <FaPaperPlane className="invert"></FaPaperPlane>
          </button>

        </div>
      </div>
    </div>
  );
}

export default ChatBox;


