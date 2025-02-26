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
    <div className="homePageAboutMeeting">
      <h1>Welcome to KadhaiKalaam</h1>
      <p>Connect with your team anytime, anywhere!</p>
      <div className="meetingButtons">
        <button
          onClick={() => {
            if (Object.keys(user.current).length > 0) {
              alert("Welcome " + user.current);
              setView(!view);
            } else {
              alert("You don't have an account. Please sign in!");
            }
          }}
          className="newMeeting"
        >
          <FaVideo
            className="icon"
            style={{ margin: "0px 10px 0px 0px" }}
          ></FaVideo>
          New
        </button>
        <button
          onClick={() => {
            setViewJoinMeeting(!viewJoinMeeting);
          }}
          className="joinMeeting"
        >
          <FaUserFriends
            style={{ margin: "0px 10px 0px 0px" }}
            className="icon"
          ></FaUserFriends>
          Join
        </button>
      </div>
    </div>
  );
}
