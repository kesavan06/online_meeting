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
  const { viewVideo, setViewVideo } = useAppContext();
  return (
    <center>
      <div className="about">
        <h1 style={{ color: "white" }}>Welcome to Meeting</h1>
        <p style={{ color: "white", marginTop: "30px",fontSize:"20px" }}>
          Connect with your team anytime, anywhere
        </p>
        <div className="whole">
          <button
            onClick={() => {
              setView(!view);
            }}
            className="newMeeting"
          >
            <FaVideo className="icon"></FaVideo>
            New Meeting
          </button>
          <button
            onClick={() => {
              setViewJoinMeeting(!viewJoinMeeting);
            }}
            className="joinMeeting"
          >
            <FaUserFriends className="icon"></FaUserFriends>
            Join Meeting
          </button>
        </div>
      </div>
    </center>
  );
}
