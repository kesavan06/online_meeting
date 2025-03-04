import "../ChatBox.css";
import { IoIosLock } from "react-icons/io";

export default function Message({ user_name, message, time, classNow , isPrivate}) {
  try {
    console.log("In messages showing - message from : ", user_name, message, isPrivate);
  } catch (error) {
    console.error("Error in Message component:", error);
  }


  return (
    <div className={classNow ? "chatThread right" : "chatThread"}>
      <div className="userDetail">
        <p id="userName">{user_name}</p>
        <p id="time">{time}</p>
        {isPrivate && <p style={{color: "#117F56", }}>(Private <IoIosLock/>) </p>}
      </div>

      <div className="messages">
        <p className="messagePara">{message}</p>
      </div>
    </div>
  );
}

