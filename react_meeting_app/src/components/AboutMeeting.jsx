import React, { useContext, useEffect, useState } from "react";
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
  const { user } = useAppContext();

  return (
    <center>
      <div className="about">
        <h1 style={{ color: "white" }}>Welcome to ConvoSpace </h1>
        <p style={{ color: "white", marginTop: "30px", fontSize: "20px" }}>
          Connect with your team anytime, anywhere!
        </p>
        <div className="whole">
          <button
            onClick={() => {
              if(Object.keys(user.current).length > 0){
                alert("Welcome "+user.current);
                setView(!view);
              }
              else{
                alert("You don't have an account. Please sign in!")
              }
            }}
            className="newMeeting"
          >
            <FaVideo className="icon"></FaVideo>
            <p style={{ marginLeft: "10px" }}>New</p>
          </button>

          <button
            onClick={() => {
              setViewJoinMeeting(!viewJoinMeeting);
            }}
            className="joinMeeting"
          >
            <FaUserFriends className="icon"></FaUserFriends>
            <p style={{ marginLeft: "10px" }}>Join</p>
          </button>
        </div>
      </div>
    </center>
  );
}
