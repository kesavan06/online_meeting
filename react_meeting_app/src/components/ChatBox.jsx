import React from "react";
import { FaUsers } from "react-icons/fa";
import { FaFaceSmile } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa";
import "../ChatBox.css";

function ChatBox() {
  return (
    <div className="chatBox">
      <div className="chatDisplay">
        <div className="chatThread">
          <div className="userDetail">
            <p id="name">Kesavan</p>
            <p id="time">11:11 am</p>
          </div>
          <div className="message">
            <p className="messagePara">
              A paragraph is a group of sentences that are organized around a
              single topic or idea.
            </p>
          </div>
        </div>
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
          <input type="text" placeholder="Enter your message..."></input>
          <button>
            <FaFaceSmile className="invert"></FaFaceSmile>
          </button>
          <button>
            <FaPaperPlane className="invert"></FaPaperPlane>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
