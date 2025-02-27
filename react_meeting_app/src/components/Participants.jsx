import React, { useEffect, useState } from "react";
import "../Participants.css";
import ShowParticipant from "./ShowPartipants";

import { useAppContext } from "../Context";


function Participants({ view, setView, setParticipantLength, getPaticipants }) {

  let [allParticipants, setParticipants] = useState([]);
  let { socketRef, roomId } = useAppContext();

  useEffect(() => {
    setTimeout(async () => {
      setParticipants([]);
      let participant = await getPaticipants(roomId.current);
      console.log("Participants : ", participant.data);

      setParticipantLength((prev) => prev = participant.data.length);


      for (let p of participant.data) {
        let name = p.name;
        console.log("Name : ", name);
        setParticipants((prev) => [...prev, name]);
      }
    }, 100);
  }, [!view]);


  return (
    <div className="participantsBox">
      {allParticipants.map((participant) => {
        return <ShowParticipant name={participant} index={allParticipants.indexOf(participant) + 1} />
      })}
    </div>
  );
}

export default Participants;
