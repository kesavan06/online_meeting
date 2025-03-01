import "../ChatBox.css";
// import { useAppContext } from "../Context"
import Message from "./Messages";
import Poll from "./Poll";

export default function ShowMessage(props) {
  return (
    <>
      {props.newMessages.map((message) => {

        console.log("Message : ", message);
        
        return (
          message.type == "poll" ?
            <Poll poll={message.message} user_name={message.user_name} time={message.time} isMine={message.isMine}></Poll>
            : <Message
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

