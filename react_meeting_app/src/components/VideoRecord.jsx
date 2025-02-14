import React from "react";
import { FaRecordVinyl } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";

import "../VideoRecord.css";

function VideoRecord() {
  return (
      <div className="recordElement">
        <div className="recordIconBox">
          <FaRecordVinyl className="recordIcon"></FaRecordVinyl>
        </div>
        <div className="recordTime">
          <div className="round"></div>
          <p>LIVE 1:23</p>
        </div>
        <div className="stopRecord">
            <FaCircleStop className="stopRecordIcon"></FaCircleStop>
        </div>
      </div>
  );
}

export default VideoRecord;
