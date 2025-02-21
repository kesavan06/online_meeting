import React, { useState } from "react";
import "../Participants.css";
import ShowParticipant from "./ShowPartipants";



function Participants() {

  let [allParticipants, setParticipants] = useState(["Deepa"]);
  let [count, setCount] = useState(0);


  return (
    <div className="participantsBox">
     {allParticipants.map((participant)=>{
      return <ShowParticipant name={participant} index={allParticipants.indexOf(participant)+1} />
     })}
    </div>
  );
}

export default Participants;
