import React, { useEffect, useState, useRef } from "react";
import { FaUsers } from "react-icons/fa";
import { FaFaceSmile } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import "../ChatBox.css";
import ShowMessage from "./ShowMessages";
import { useAppContext } from "../Context";


function ChatBox() {

  let { user_name, socketRef, roomId } = useAppContext();

  let [allMessage, setAllMessage] = useState([{ user_name: "Kesavan", message: " A paragraph is a group of sentences that are organized around a single topic or idea.",time:"05.10 PM" }])

  let message = useRef("");


  function handleSendMessage() {

    let newM;
    const today = new Date();
    console.log(today.toLocaleString());

    let getTodayTime = today.toLocaleTimeString();
    let splitDay = getTodayTime.split(":");
    
    let day = (+splitDay[0]) >12 ? (+splitDay[0])-12+"."+splitDay[1]+" PM":   splitDay[0]+"."+splitDay[1]+" AM" ;

    if (message != "") {

      console.log("Room : ", roomId.current);
      console.log("Message : ", message.current);


      newM = {
        user_name: user_name.current,
        message: message.current,
        sender_id: socketRef.current.id,
        room_id: roomId.current,
        time: day,
      }

      // console.log("Object: ", newM);

      socketRef.current.emit("sendMessage", (newM));

    }

  }



  useEffect(() => {
    console.log("All messages: ", allMessage);
    console.log("Message: ", message);


    socketRef.current.on("receivedMessage",( msg)=>{
      console.log("Message received: ",msg);
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
        </div>
        <div className="sentInputBox">
          <input type="text" placeholder="Enter your message..." onChange={(e) => message.current = (e.target.value)}></input>
          <button>
            <FaFaceSmile className="invert"></FaFaceSmile>
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
