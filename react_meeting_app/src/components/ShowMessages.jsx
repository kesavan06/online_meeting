import { useState } from "react";
import "../ChatBox.css";
// import { useAppContext } from "../Context"
import Message from "./Messages";
import Poll from "./Poll";

export default function ShowMessage(props) {
  const [userClick,setUserClick] = useState(false);

  return (
    <>
      {props.newMessages.map((message, index) => {
        // console.log("Message : ", message);

        // setUserClick(!userChoice);
        return message.type == "poll" ? (
          
          <Poll
            key={index}
            poll={message.message}
            user_name={message.user_name}
            time={message.time}
            sender_id={message.sender_id}
            isMine={message.isMine}
            userChoice={message.userChoice}
            userClick={userClick}
            setUserClick={setUserClick}
          ></Poll>
        ) : (
          <Message
            key={index}
            user_name={message.user_name}
            message={message.message}
            time={message.time}
            classNow={message.isMine}
            isPrivate={message.isPrivate}
          ></Message>
        );
      })}
    </>
  );
}
