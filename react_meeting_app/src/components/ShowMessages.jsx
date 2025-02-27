import "../ChatBox.css";
// import { useAppContext } from "../Context"
import Message from "./Messages";
import Poll from "./Poll";

export default function ShowMessage(props) {
  return (
    <>
      {props.newMessages.map((message) => {
        console.log(message.type)

        return (
          message.type == "poll" ?
             <Poll title={message.title} option1={message.option1} option2={message.option2} user_name={message.user_name}></Poll>
             :<Message
             user_name={message.user_name}
             message={message.message}
             time={message.time}
             classNow={message.isMine}
           ></Message>
        );
      })}
    </>
  );
}
