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
import { HiOutlineSave } from "react-icons/hi";
// import EmojiPicker from 'emoji-picker-react';

function ChatBox({
  view,
  setView,
  isPoll,
  setIsPoll,
  allMessage,
  setAllMessage,
  allParticipants,
  isPrivate,
  saveChat,
}) {
  let { user_name, socketRef, roomId, toSocket } = useAppContext();
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

    let day = splitDay[0].concat(
      ".",
      splitDay[1],
      " ",
      splitDay[2].slice(3).toUpperCase()
    );

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
        type: "msg",
        userChoice: [],
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
      let fetchAllMessages = await fetch(
        "https://10.89.72.171:3002/allMessages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: roomId.current }),
        }
      );
      setAllMessage([]);

      let allM = await fetchAllMessages.json();
      let message;

      let allMNow = [];

      for (let m of allM.data) {
        if (
          m.sender_id == socketRef.current.id &&
          m.isPrivate &&
          m.receiver_id !== undefined
        ) {
          // console.log(1);
          allMNow.push(m);
        }
        if (m.receiver_id == socketRef.current.id && m.isPrivate) {
          allMNow.push(m);
        }
        if (!m.isPrivate && m.receiver_id == undefined) {
          allMNow.push(m);
        }
      }

      console.log("All grouped messages : ", allMNow);

      message = allMNow;

      for (let mess of message) {
        let isMine = false;
        if (mess.sender_id == socketRef.current.id) {
          isMine = true;
        }
        mess.isMine = isMine;

        setAllMessage((prev) => [...prev, mess]);
      }
    }, 100);
  }, [view]);

  const handleNewMessage = (msg) => {
    console.log("MSG TYPE: ", msg.type);

   
    console.log("MSG TYPE: ", msg.type);
    let obj;
    if (msg.type == "vote1") {
      let obj;
      for (let i = 0; i < allMessage.length; i++) {
        if (
          allMessage[i].type == "poll" &&
          allMessage[i].message.index == msg.index
        ) {
          allMessage[i].message.answer1 += 1;
          allMessage[i].message.totalVote += 1;
          let poll = allMessage[i].userChoice;
          let isExist = false;
          for (let j = 0; j < poll.length; j++) {
            if (poll[j].senderId == msg.sender_id) {
              poll[j].answer = "vote1";
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            let object = { senderId: msg.sender_id, answer: "vote1" };
            allMessage[i].userChoice.push(object);
          }
          obj = allMessage[i];
          allMessage[i] = obj;
          setAllMessage((prev) => [...prev]);

          break;
        }
      }
    } else if (msg.type == "vote2") {
      let obj;
      for (let i = 0; i < allMessage.length; i++) {
        if (
          allMessage[i].type == "poll" &&
          allMessage[i].message.index == msg.index
        ) {
          allMessage[i].message.answer2 += 1;
          allMessage[i].message.totalVote += 1;
          let poll = allMessage[i].userChoice;
          let isExist = false;
          for (let j = 0; j < poll.length; j++) {
            if (poll[j].senderId == msg.sender_id) {
              poll[j].answer = "vote2";
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            let object = { senderId: msg.sender_id, answer: "vote2" };
            allMessage[i].userChoice.push(object);
          }
          obj = allMessage[i];
          allMessage[i] = obj;
          setAllMessage((prev) => [...prev]);

          break;
        }
      }
    } else if (msg.type == "decreaseVote2AndIncreaseVote1") {
      for (let i = 0; i < allMessage.length; i++) {
        if (
          allMessage[i].type == "poll" &&
          allMessage[i].message.index == msg.index
        ) {
          allMessage[i].message.answer1 += 1;
          allMessage[i].message.answer2 -= 1;
          // allMessage[i].message.check = "vote1";
          let poll = allMessage[i].userChoice;
          let isExist = false;
          for (let j = 0; j < poll.length; j++) {
            if (poll[j].senderId == msg.sender_id) {
              poll[j].answer = "vote1";
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            let object = { senderId: msg.sender_id, answer: "vote1" };
            allMessage[i].userChoice.push(object);
          }
          obj = allMessage[i];
          allMessage[i] = obj;
          setAllMessage((prev) => [...prev]);

          break;
        }
      }
    } else if (msg.type == "decreaseVote1") {
      for (let i = 0; i < allMessage.length; i++) {
        if (
          allMessage[i].type == "poll" &&
          allMessage[i].message.index == msg.index
        ) {
          allMessage[i].message.answer1 -= 1;
          allMessage[i].message.totalVote -= 1;
          // allMessage[i].message.check = "";
          let poll = allMessage[i].userChoice;
          let isExist = false;
          for (let j = 0; j < poll.length; j++) {
            if (poll[j].senderId == msg.sender_id) {
              poll[j].answer = "";
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            let object = { senderId: msg.sender_id, answer: "" };
            allMessage[i].userChoice.push(object);
          }
          obj = allMessage[i];
          allMessage[i] = obj;
          setAllMessage((prev) => [...prev]);

          break;
        }
      }
    } else if (msg.type == "decreaseVote1AndIncreaseVote2") {
      for (let i = 0; i < allMessage.length; i++) {
        if (
          allMessage[i].type == "poll" &&
          allMessage[i].message.index == msg.index
        ) {
          allMessage[i].message.answer1 -= 1;
          allMessage[i].message.answer2 += 1;
          // allMessage[i].message.check = "vote2";
          let poll = allMessage[i].userChoice;
          let isExist = false;
          for (let j = 0; j < poll.length; j++) {
            if (poll[j].senderId == msg.sender_id) {
              poll[j].answer = "vote2";
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            let object = { senderId: msg.sender_id, answer: "vote2" };
            allMessage[i].userChoice.push(object);
          }
          obj = allMessage[i];
          allMessage[i] = obj;
          setAllMessage((prev) => [...prev]);
          break;
        }
      }
    } else if (msg.type == "decreaseVote2") {
      let obj;
      for (let i = 0; i < allMessage.length; i++) {
        if (
          allMessage[i].type == "poll" &&
          allMessage[i].message.index == msg.index
        ) {
          allMessage[i].message.answer2 += 1;
          allMessage[i].message.totalVote += 1;
          // allMessage[i].message.check = "";
          let poll = allMessage[i].userChoice;
          let isExist = false;
          for (let j = 0; j < poll.length; j++) {
            if (poll[j].senderId == msg.sender_id) {
              poll[j].answer = "";
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            let object = { senderId: msg.sender_id, answer: "" };
            allMessage[i].userChoice.push(object);
          }
          obj = allMessage[i];
          allMessage[i] = obj;
          setAllMessage((prev) => [...prev]);

          break;
        }
      }
    } else {
      let isMyMessage = false;
      let { user_name, message, sender_id, time, type, isPrivate, userChoice } =
        msg;
      let msgGot = {
        user_name,
        message,
        time,
        type,
        isPrivate,
        sender_id,
        userChoice,
      };

      console.log("Inside message  : ", msg);

      if (socketRef.current.id == sender_id) {
        isMyMessage = true;
      }

    let sendClass = isMyMessage;
    // console.log("Message is mine : ", isMyMessage);

      setAllMessage((exsistingMessages) => [
        ...exsistingMessages,
        { ...msgGot, isMine: sendClass },
      ]);
    }

    // }
  };

  useEffect(() => {
    socketRef.current.off("receivedMessage");

    socketRef.current.on("receivedMessage", (msg) => {
      console.log("Message received from server ", msg);
      handleNewMessage(msg);
    });
  }, [allMessage]);

  useEffect(() => {
    console.log("All message : ", allMessage);
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

          <ShowOptions
            parArray={allParticipants}
            isPrivate={isPrivate}
          ></ShowOptions>

          {showEmoji && (
            <Emoji
              emojiHandle={checkTheEmojiClicked}
              handleOpen={handleOpen}
              handleShowEmoji={handleShowEmoji}
            />
          )}
          <button className="pollButton" onClick={() => setIsPoll(true)}>
            Poll
          </button>

          <button
            className="saveChat"
            onClick={() => saveChat(socketRef.current.id)}
          >
            <HiOutlineSave className="save" />
          </button>
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
