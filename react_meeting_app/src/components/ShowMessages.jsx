import "../ChatBox.css"
// import { useAppContext } from "../Context"
import Message from "./Messages"

export default function ShowMessage(props) {

  return (
    <>
      {props.newMessages.map((message) => {
        { console.log("Message: ", message) }

        return <Message user_name={message.user_name} message={message.message} time={message.time} ></Message>
      })
      }
    </>
  )

}

