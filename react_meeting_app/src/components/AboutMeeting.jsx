import React, { useContext, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import "../AboutMeeting.css";
import { useAppContext } from "../Context";

export default function AboutMeeting({
  view,
  setView,
  viewJoinMeeting,
  setViewJoinMeeting,
}) {
  return (
    <center>
      <div className="about">
        <h1 style={{ color: "white" }}>Welcome to ConvoSpace</h1>
        <p style={{ color: "white", marginTop: "30px", fontSize: "20px" }}>
          Connect with your team anytime, anywhere!
        </p>
        <div className="whole">
          <button
            onClick={() => {
              setView(!view);
            }}
            className="newMeeting"
          >
            <FaVideo className="icon"></FaVideo>
            New
          </button>
          <button
            onClick={() => {
              setViewJoinMeeting(!viewJoinMeeting);
            }}
            className="joinMeeting"
          >
            <FaUserFriends className="icon"></FaUserFriends>
            Join
          </button>
        </div>
      </div>
    </center>
  );
}
