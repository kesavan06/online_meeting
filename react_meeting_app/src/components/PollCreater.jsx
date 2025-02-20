import { useState } from "react";
import Poll from "./Poll";
import "../pollCreater.css";


export default function PollCreater()
{
    const [poll,setPoll] = useState([{title:"Do you know Html?",option1:"Yes",option2:"No"}]);
    const [newPoll,createNewPoll] = useState({title:"",option1:"",option2:""});
``
    function valueChange(e)
    {
        const {name,value} = e.target;
        createNewPoll({...newPoll,[name] : value});
    }

    function pollCreater(e)
    {
        console.log("Inside");
        e.preventDefault();
        if(!newPoll.title || !newPoll.option1 || !newPoll.option2) return;

        const value = { title: newPoll.title, option1: newPoll.option1, option2: newPoll.option2 };
        setPoll([...poll,value]);
        createNewPoll({title:"",option1:"",option2:""});
        console.log("Last line in the function");
    }

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
        <div>
            <form onSubmit={pollCreater} style={{width:"500px",height:"500px",display:"flex",justifyContent:"space-around",flexDirection:"column",textAlign:"left"}}>
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