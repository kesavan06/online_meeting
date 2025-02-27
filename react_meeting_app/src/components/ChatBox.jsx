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
// import EmojiPicker from 'emoji-picker-react';

function ChatBox({ view, setView, isPoll, setIsPoll, allMessage, setAllMessage }) {
  let { user_name, socketRef, roomId } = useAppContext();
  // let [allMessage, setAllMessage] = useState([]);

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

    let day =
      +splitDay[0] > 12
        ? +splitDay[0] - 12 + "." + splitDay[1] + " PM"
        : splitDay[0] + "." + splitDay[1] + " AM";
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
        type: "msg"
      };

      // console.log("Object: ", newM);
      socketRef.current.emit("sendMessage", newM);
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

      // console.log("All Messages: ",fetchAllMessages );

      let allM = await fetchAllMessages.json();
      console.log("AllMEssages:  ", allM);
      console.log("AllMEssages:  ", allM.data.messages);
      console.log("Participants:  ", allM.data.participants);
      let message = allM.data.messages;

      for (let mess of message) {
        let isMine = false;
        if (mess.sender_id == socketRef.current.id) {
          isMine = true;
        }
        mess.isMine = isMine;
        console.log("Is mine : ", isMine);
        console.log("Mess Final : ", mess);
        setAllMessage((prev) => [...prev, mess]);
      }

    }, 100)
  }, [view])

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

  const handleNewMessage = (msg) => {
    // setAllMessage("")
    // for (let msg of allMess) {

    let isMyMessage = false;

    let { user_name, message, sender_id, time } = msg;
    let msgGot = { user_name, message, time };

    if (socketRef.current.id == sender_id) {
      isMyMessage = true;
    }

    let sendClass = isMyMessage;
    console.log("Message is mine : ", isMyMessage);

    setAllMessage((exsistingMessages) => [
      ...exsistingMessages,
      { ...msgGot, isMine: sendClass },
    ]);
    // }
  };

  // const handleNewMessageFirstTime = (allMess) => {

  //   // setAllMessage("")
  //   setAllMessage((prev) => console.log(prev));

  //   for (let msg of allMess) {
  //     let isMyMessage = false;

  //     let { user_name, message, sender_id, time } = msg;
  //     let msgGot = { user_name, message, time };

  //     if (socketRef.current.id == sender_id) {
  //       isMyMessage = true;
  //     }

  //     let sendClass = isMyMessage;
  //     console.log("Message is mine : ", isMyMessage);

  //     setAllMessage((exsistingMessages) => [...(exsistingMessages), { ...msgGot, isMine: sendClass }]);
  //   }

  // }

  // useEffect(() => {
  //   async function getMess() {
  //     let allMessGet = await fetch("http://localhost:3002/messObject", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ roomId: roomId.current }),
  //     })

  //   console.log("All mess : ",allMessGet);

  //   }

  //   getMess();
  //   // handleNewMessageFirstTime();
  // }, [])

  useEffect(() => {
    console.log("All messages: ", allMessage);
    socketRef.current.off("receivedMessage");

    socketRef.current.on("receivedMessage", (msg) => {
      console.log("Message received: ", msg);
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
          {/* <p>To</p>
          <select className="selectUser">
            <option>Everyone</option>
          </select> */}

          {showEmoji && (
            <Emoji
              emojiHandle={checkTheEmojiClicked}
              handleOpen={handleOpen}
              handleShowEmoji={handleShowEmoji}
            />
          )}

          {/* <button onClick={(() => setIsPoll(true))}>Poll</button> */}
          {/* {isPoll && <Wrapper>
              <PollCreater></PollCreater>
            </Wrapper>} */}
        </div>

        <div className="sentInputBox">
          <input
            type="text"
            placeholder="Enter your message..."
            ref={messageRef}
            onKeyDown={handlekeyDown}
          ></input>

          <button onClick={handleShowEmoji}>
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
