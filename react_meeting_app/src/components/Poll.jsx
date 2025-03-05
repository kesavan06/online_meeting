import "../poll.css"
import { useAppContext } from "../Context"
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function Poll({poll,user_name,time,isMine,userChoice,userClick,setUserClick})
{
    let {socketRef,roomId} = useAppContext();
    const answer1Ref=useRef(null);
    const answer2Ref=useRef(null);
    const option1Ref = useRef(null);
    const option2Ref = useRef(null);
    const socketId=socketRef.current.id;
    const [isVote1,setIsVote1] = useState(false);
    const [isVote2,setIsVote2] = useState(false);

    function increaseVote1()
    {
        console.log("Option1: ",option1Ref.current.checked);
        console.log("Option2: ",option2Ref.current.checked);
        if(isVote2)
        {
            let pollDetail = {room_id:roomId.current, index:poll.index, type:"decreaseVote2AndIncreaseVote1",sender_id:socketRef.current.id};
            socketRef.current.emit("sendMessage",pollDetail);
            console.log("answer1: ",poll.answer1);
        }
        else if(option1Ref.current.checked && option2Ref.current.checked)
        {
            let pollDetail = {room_id:roomId.current, index:poll.index, type:"decreaseVote1",sender_id:socketRef.current.id};
            socketRef.current.emit("sendMessage",pollDetail);
            console.log("answer1: ",poll.answer1);
        }
        else if(option1Ref.current.checked && !option2Ref.current.checked)
        {
            let pollDetail = {room_id:roomId.current, index:poll.index, type:"vote1",sender_id:socketRef.current.id};
            socketRef.current.emit("sendMessage",pollDetail);
            console.log("answer1: ",poll.answer1);
        }
        setTimeout(()=>{
            {setUserClick(!userClick)};
        },500)        
    }

    function increaseVote2()
    {
        console.log("Option1: ",option1Ref.current.checked);
        console.log("Option2: ",option2Ref.current.checked);
        if(isVote1)
        {
            let pollDetail = {room_id:roomId.current, index:poll.index, type:"decreaseVote1AndIncreaseVote2",sender_id:socketRef.current.id};
            socketRef.current.emit("sendMessage",pollDetail);
            console.log("answer1: ",poll.answer1);
        }
        else if(option1Ref.current.checked && option2Ref.current.checked)
        {
            let pollDetail = {room_id:roomId.current, index:poll.index, type:"decreaseVote2",sender_id:socketRef.current.id};
            socketRef.current.emit("sendMessage",pollDetail);
            console.log("answer1: ",poll.answer1);
        }
        else if(option2Ref.current.checked && !option1Ref.current.checked)
        {
            let pollDetail = {room_id:roomId.current, index:poll.index, type:"vote2",sender_id:socketRef.current.id};
            socketRef.current.emit("sendMessage",pollDetail);
            console.log("answer1: ",poll.answer1);
        }
        setTimeout(()=>{
            {setUserClick(!userClick)};
        },500)
    }


    useEffect(()=>{
        // for(let x=0; x<userChoice.length; x++)
        // {
        //     if(userChoice[x] && userChoice[x].senderId==socketId && userChoice[x].answer=="vote1")
        //     {
        //         setIsVote1(true);
        //         setIsVote2(false);
        //     }
        // }

        // for(let x=0; x<userChoice.length; x++)
        // {
        //     if(userChoice[x] && userChoice[x].senderId==socketId && userChoice[x].answer=="vote2")
        //     {
        //         setIsVote2(true);
        //         setIsVote1(false);
        //     }
        // }
        let hasVote1=userChoice.some(obj=>obj.senderId==socketId && obj.answer=="vote1");
        let hasVote2=userChoice.some(obj=>obj.senderId==socketId && obj.answer=="vote2");
        setIsVote1(hasVote1);
        setIsVote2(hasVote2);
    },[userClick]);
    

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
                    {/* {
                        userChoice.map((obj)=>{
                            return(<input checked={obj.senderId==socketId && obj.answer=="vote1" ? true : false} ref={option1Ref} className="pollRadioButton" type="radio" onChange={increaseVote1} name="poll"></input>)
                        })
                    } */}
                    <input checked={isVote1 ? true : false} ref={option1Ref} className="pollRadioButton" type="radio" onChange={increaseVote1} name="poll"></input>
                {poll.option1}</label>
                <progress ref={answer1Ref} value={+(poll.answer1/poll.totalVote)*100} max="100"></progress>
                <label className="option">
                    {/* {
                        userChoice.map((obj)=>{
                            return(<input checked={obj.senderId==socketId && obj.answer=="vote2" ? true : false} ref={option2Ref} className="pollRadioButton" type="radio" name="poll" onChange={increaseVote2}></input>)
                        })
                    }     */}
                    <input checked={isVote2 ? true : false} ref={option2Ref} className="pollRadioButton" type="radio" name="poll" onChange={increaseVote2}></input>
                {poll.option2}</label>
                <progress ref={answer2Ref} value={(poll.answer2/poll.totalVote)*100} max="100"></progress>
            </div>
        </div>
    )
}

