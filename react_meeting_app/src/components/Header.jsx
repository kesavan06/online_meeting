// import Signin from "./Signin";
// import Signup from "./Signup";
import { useEffect } from "react";
import { useAppContext } from "../Context";
import "../Header.css";
// import { useState } from "react";

import LoginProfile from "./LoginProfile";

export default function Header({
  showSignUp,
  setShowSignUp,
  showSignIn,
  setShowSignIn,
  cookie,
  setCookie,
  hasCookie,
  setHasCookie,
  removeCookie,
  setHistory
}) {

  const { user_name, user_id } = useAppContext();

  function showSignUp() {
    setShowSignUp(true);
    setShowSignIn(false);
    console.log("sign in: " + showSignIn);
    console.log("Sign up: " + showSignUp);
  }

  function showSignIn() {
    console.log("sign in: " + showSignIn);
    console.log("Sign up: " + showSignUp);
    setShowSignIn(true);
    setShowSignUp(false);
  }

  useEffect(() => {
    if (document.cookie) {
      console.log("Cookie in header: ", cookie);
      setHasCookie(prev => prev = true);
    }
  }, [])


  function handleLogOut() {
    console.log("Log out confirmed");
    let keys = Object.keys(cookie);
    for (let k of keys) {
      removeCookie(k);
    }

    user_name.current = "";
    user_id.current = "";

    setHasCookie(prev => prev = false);

  }


  return (
    <div className="homePageHeader">
      <div className="iconAndName">
        <img style={{ width: "70px" }} src="meetingLogo2.png"></img>
        <h2>KathaiKalaam</h2>
      </div>
      <div className="navLogin">
        {!hasCookie &&
          <p onClick={showSignIn}>Sign in</p>
        }
        {hasCookie &&
          <LoginProfile cookie={cookie} handleLogOut={handleLogOut} setHistory={setHistory}/>
        }
      </div>
    </div>
  );
}

