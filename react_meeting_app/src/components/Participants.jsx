import React, { useEffect, useState } from "react";
import "../Participants.css";
import ShowParticipant from "./ShowPartipants";

import { useAppContext } from "../Context";


function Participants({ view, setParticipantLength, allParticipants, setAllParticipants }) {

  let { socketRef, roomId } = useAppContext();


  // useEffect(() => {
  //   console.log("All Names : ", allParticipants);
  // }, [allParticipants])


  return (
    <div className="participantsBox">
      {allParticipants.map((participant) => {
        return <ShowParticipant name={participant.name} socketId={participant.socketId} host={participant.host} allParticipants={allParticipants} />
      })}
    </div>
  );
}

export default Participants;
