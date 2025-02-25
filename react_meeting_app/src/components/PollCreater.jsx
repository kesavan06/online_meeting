import { useEffect, useState } from "react";
import Poll from "./Poll";
import "../pollCreater.css";
import { useAppContext } from "../Context";


export default function PollCreater()
{
    const [poll,setPoll] = useState([]);
    const [newPoll,createNewPoll] = useState({title:"",option1:"",option2:"",userName:"",room_Id:""});
    const {user_name,socketRef,roomId} = useAppContext();
    const [isPoll,setIsPoll] = useState(false);

    function valueChange(e)
    {
        const {name,value} = e.target;
        createNewPoll({...newPoll,[name] : value});
    }

    function pollCreater(e)
    {
        console.log("Inside the poll creater function");
        e.preventDefault();
        if(!newPoll.title || !newPoll.option1 || !newPoll.option2) return;

        const value = { title: newPoll.title, option1: newPoll.option1, option2: newPoll.option2,userName:user_name.current,room_Id:roomId.current };
        socketRef.current.emit("sendPoll",value);
        console.log("Value: ",value);
        
        createNewPoll({title:"",option1:"",option2:"",userName:"",room_Id:""});
        console.log("Last line in the function");
        setIsPoll(!isPoll);
    }

    // useEffect(()=>{
        // console.log("poll",poll);
        socketRef.current.on("receivedPoll",(pollObj)=>{
            console.log("POLL OBJECT",pollObj);
            setPoll([...poll,pollObj]);
        })
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

    return(
        <div id="pollContainer">
            <form onSubmit={pollCreater} style={{width:"100%",height:"50%",display:"flex",justifyContent:"space-around",flexDirection:"column",textAlign:"left"}}>
                <label>Title</label>
                <input className="inputBox" type="text" name="title" onChange={valueChange} value={newPoll.title} placeholder="Type your question here" required></input>
                <label>Answer Options</label>
                <input className="inputBox" type="text" name="option1" onChange={valueChange} value={newPoll.option1} required></input>
                <input className="inputBox" type="text" name="option2" onChange={valueChange} value={newPoll.option2} required></input>
                <button className="inputBox" type="submit">Create Poll</button>
            </form>
            {
                poll.map((data)=>{
                    return <Poll title={data.title} option1={data.option1} option2={data.option2}></Poll>
                })
            }
        </div>
    )
}