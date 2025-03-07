import React, { useEffect, useState } from "react";
import { FaRecordVinyl } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";

import "../VideoRecord.css";
import { stopRecord } from "../Recording";

function VideoRecord({sec,min,setMin,setSec,setIsRecord,isRecord,isRun,setIsRun}) {

  // function recordingTimer()
  // {
  //   let sec=0;
  //   setInterval(()=>{

  //   })
  // }


  // function stopRecording() {
  //   try {
  //     stopRecord();
  //     console.log("Recording stop!!!");
  //     stopTimer();
  //     setIsRecord(false);
  //   }
  //   catch (err) {
  //     console.log("Error: " + err);
  //   }
  // }


  // function stopTimer()
  // {
  //   clearInterval(interval);
  //   setIsRun(false);
  //   setSec(0);
  //   setMin(0);
  // }

  
  return (
      <div className="recordElement">
        <div className="recordTime">
          <div className="round"></div>
          <p>LIVE {min}:{sec}</p>
        </div>
      </div>
  );
}

export default VideoRecord;
