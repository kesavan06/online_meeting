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
  setShowSignIn,
  displayMessage,
  cookie,
  oneTimeCookie,
  setOneTimeCookie
}) {
  const { user_name, user_id } = useAppContext();

  useEffect(() => {

    if (document.cookie && !oneTimeCookie) { 
      // console.log("Cookie : ", cookie);
      user_name.current = cookie.user_name;
      user_id.current = cookie.user_id;

      console.log("User name, id About meeting in: ", user_id, user_name);
      setOneTimeCookie((prev) => prev = !prev)
    }
  })

  return (
    <div className="homePageAboutMeeting">
    <h1>Connect with your team anytime, anywhere!</h1>
    <div className="meetingButtons">
      <button
        onClick={() => {
          if(Object.keys(user_name.current).length > 0){
            // alert("Welcome "+user.current);
            displayMessage((prev)=> prev=false)
            setView(!view);
          }
          else{
            displayMessage((prev)=> prev=true)
            setShowSignIn((prev)=> prev=true);
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
