import "../poll.css"
import { useAppContext } from "../Context"
import { useRef } from "react";

export default function Poll({poll,user_name,time,isMine})
{
    let {socketRef,roomId} = useAppContext();
    const answer1Ref=useRef(null);
    const answer2Ref=useRef(null);

    function increaseVote()
    {
        let pollDetail = {room_id:roomId.current, index:poll.index, type:"vote1"};
        socketRef.current.emit("sendMessage",pollDetail);
        console.log("answer1: ",poll.answer1);
        setTimeout(()=>{
            answer1Ref.current.value=poll.answer1;
        },1000);
    }

    return(
        <div id="pollWholeContainer" className={isMine ? "rightSide" : "leftSide"}>
            <div id="userDetails">
                <div id="name">
                    <p>{user_name}</p>
                </div>
                <div id="time">
                    <p>{time}</p>
                </div>
            </div>
            <div id="pollDiv">
                <h2 id="pollTitle">{poll.title}</h2>
                <label className="option">
                    <input className="pollRadioButton" type="radio" onChange={increaseVote} name="poll"></input>
                {poll.option1}</label>
                <progress ref={answer1Ref} value={poll.answer1} max="10"></progress>
                <label className="option">
                    <input className="pollRadioButton" type="radio" name="poll"></input>    
                {poll.option2}</label>
                <progress ref={answer2Ref} value={poll.answer2} max="100"></progress>
            </div>
        </div>
    )
}

