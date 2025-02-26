// import Signin from "./Signin";
// import Signup from "./Signup";
import "../Header.css";
// import { useState } from "react";

export default function Header({
  showSignUp,
  setShowSignUp,
  showSignIn,
  setShowSignIn,
}) {
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

  return (
    <div className="homePageHeader">
      <div className="iconAndName">
        <h1>KadhaiKalaam</h1>
      </div>
      <div className="navLogin">
        <p onClick={showSignUp}>Signup</p>
        <p onClick={showSignIn}>Signin</p>
      </div>
    </div>
  );
}
