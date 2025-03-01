import "../ChatBox.css";
// import { useAppContext } from "../Context"
import Message from "./Messages";
import Poll from "./Poll";

export default function ShowMessage(props) {
  return (
    <>
      {props.newMessages.map((msg) => {
        console.log("MESSAGE",msg);
        console.log("type: ",msg.type);

        return (
          msg.type == "poll" ? 
             <Poll poll={msg.message} user_name={msg.user_name} time={msg.time} isMine={msg.isMine}></Poll>
             :<Message
             user_name={msg.user_name}
             message={msg.message}
             time={msg.time}
             classNow={msg.isMine}
           ></Message>
        );
      })}
    </>
  );
}

