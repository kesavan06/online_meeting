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

  let [allMessage, setAllMessage] = useState([{ user_name: "Kesavan", message: " A paragraph is a group of sentences that are organized around a single topic or idea.", time: "05.10 PM" }])

  let messageRef = useRef("");
  // let [messageNow, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);


  function handleSendMessage() {

    let newM;
    let messageText = messageRef.current.value;
    messageText = messageText.trim();

    const today = new Date();
    console.log(today.toLocaleString());

    let getTodayTime = today.toLocaleTimeString();
    let splitDay = getTodayTime.split(":");

    let day = (+splitDay[0]) > 12 ? (+splitDay[0]) - 12 + "." + splitDay[1] + " PM" : splitDay[0] + "." + splitDay[1] + " AM";

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
    switch (msg) {
      case "thumbs_up":
        messageRef.current.value += "👍";
        break;
    }
  }







  function handleShowEmoji() {
    setShowEmoji(!showEmoji);
  }


  useEffect(() => {
    console.log("All messages: ", allMessage);
    // console.log("Message: ", message);


    socketRef.current.on("receivedMessage", (msg) => {
      console.log("Message received: ", msg);
      setAllMessage([...allMessage, msg]);

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

          {showEmoji && <Emoji emojiHandle={checkTheEmojiClicked} />}
         
        </div>

        <div className="sentInputBox">
          <input type="text" placeholder="Enter your message..." ref={messageRef}></input>

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


