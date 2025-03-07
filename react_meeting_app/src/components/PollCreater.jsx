import { useEffect, useState } from "react";
import Poll from "./Poll";
import "../pollCreater.css";
import { useAppContext } from "../Context";


export default function PollCreater({ allMessage, setAllMessage, isPoll, setIsPoll }) {
    // const [poll,setPoll] = useState([]);
    const [newPoll, createNewPoll] = useState({ title: "", option1: "", option2: "", userName: "", room_Id: "", type: ""});
    const { user_name, socketRef, roomId } = useAppContext();
    // const [isPoll,setIsPoll] = useState(false);
    // console.log("socketref",socketRef);

    useEffect(()=>{
        // socketRef.current = io("https://10.89.72.171:3002")
        // console.log("I am inside effect in receive");
        socketRef.current.on("receivedPoll",( poll) => {
            console.log("POLL OBJECT", poll);

            // setAllMessage((prevMsg)=>[...prevMsg,poll]);
            socketRef.current.off("receivedPoll");
        })
        // return ()=>{
        //     socketRef.current.off("receivedPoll");
        // }
    },[isPoll]);

    // useEffect(()=>{
    //     console.log("All mess in poll : ",allMessage);
    // },[allMessage])

    function valueChange(e) {
        const { name, value } = e.target;
        createNewPoll({ ...newPoll, [name]: value });
    }

    function pollCreater(e) {
        console.log("Inside the poll creater function");
        e.preventDefault();
        if (!newPoll.title || !newPoll.option1 || !newPoll.option2) return;
        
        let today=new Date();
        let todayTime=today.toLocaleTimeString();
        let splitTime=todayTime.split(":");
        let time = +splitTime[0] > 12 
            ? +splitTime[0]-12 + ":" +splitTime[1] + " PM"
            : splitTime[0] + ":" +splitTime[1] + " AM";

        if(splitTime[0] == 12)
        {
            time = splitTime[0] + ":" + splitTime[1] + " PM"
        }

        const message = {title: newPoll.title, option1:newPoll.option1, option2:newPoll.option2, answer1:0,answer2:0,totalVote:0,index:""};
        const value = { user_name: user_name.current, message,sender_id:socketRef.current.id,room_id: roomId.current, time:time,type: "poll",userChoice:[]};
        socketRef.current.emit("sendMessage", value);
        setIsPoll(!isPoll);
        console.log("Value: ", value);

        createNewPoll({ title: "", option1: "", option2: "", userName: "", room_Id: "", type: "" });
        console.log("Last line in the function");
        
    }

    function cancelPoll()
    {
        setIsPoll(false);
    }
    

    // useEffect(()=>{
    // // console.log("poll",poll);
    // socketRef.current.on("receivedPoll", (pollObj) => {
    //     console.log("POLL OBJECT", pollObj);
    //     setAllMessage([...allMessage, pollObj]);
    // })
    // },[isPoll]);


    // function pollCreater(e)
    // {
    //     e.preventDefault();
    //     if(!newPoll.title || !newPoll.option1 || !newPoll.option2) return;
    //     const value={
    //         title:newPoll.title,
    //         option1:newPoll.option1,
    //         option2:newPoll.option2
    //     }
    //     setPoll([...poll,value]);
    //     createNewPoll({title:"",option1:"",option2:""});
    // }

    return (
        <div id="pollContainer">
            <form onSubmit={pollCreater} style={{ width: "400px", height: "410px", display: "flex", justifyContent: "space-around", flexDirection: "column", textAlign: "left" }}>
                <label>Title</label>
                <input className="inputBox" type="text" name="title" onChange={valueChange} value={newPoll.title} placeholder="Type your question here" required></input>
                <label>Answer Options</label>
                <input className="inputBox" type="text" name="option1" onChange={valueChange} value={newPoll.option1} required></input>
                <input className="inputBox" type="text" name="option2" onChange={valueChange} value={newPoll.option2} required></input>
                <div className="btns">
                    <button className="pollCancelBtn" onClick={cancelPoll}>Cancel</button>
                    <button className="createPollBtn" type="submit">Create Poll</button>
                </div>
            </form>
            {/* {
                poll.map((data)=>{
                    return <Poll title={data.title} option1={data.option1} option2={data.option2}></Poll>
                })
            } */}
        </div>
    )
}