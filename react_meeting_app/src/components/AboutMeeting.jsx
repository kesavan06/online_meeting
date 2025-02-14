import React, { useState } from "react";
import { FaVideo } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import "../AboutMeeting.css";

export default function AboutMeeting() {
  return (
    <center>
      <div className="about">
        <h1 style={{ color: "white" }}>Welcome to Meeting</h1>
        <p style={{ color: "white", marginTop: "30px" }}>
          Connect with your team anytime, anywhere
        </p>
        <div className="whole">
          <button
            className="newMeeting"
            onClick={() => setViewMeeting(!viewMeeting)}
          >
            <FaVideo className="icon"></FaVideo>
            New Meeting
          </button>
          <button className="joinMeeting">
            <FaUserFriends className="icon"></FaUserFriends>
            Join Meeting
          </button>
        </div>
      </div>
    </center>
  );
}
