import "../ChatBox.css";
// import { useAppContext } from "../Context"
import Message from "./Messages";
import Poll from "./Poll";

export default function ShowMessage(props) {
  return (
    <>
      {props.newMessages.map((message, index) => {
        // console.log("Message : ", message);

        return message.type == "poll" ? (
          <Poll
            key={index}
            poll={message.message}
            user_name={message.user_name}
            time={message.time}
            isMine={message.isMine}
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
