// import Signin from "./Signin";
// import Signup from "./Signup";
import "../Header.css";
// import { useState } from "react";



export default function Header({ showSignUp, setShowSignUp, showSignIn, setShowSignIn }) {

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
        <div>
            <div id="whole">
                <div style={{width:"300px",height:"60px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <img src="Logo2.png" style={{width:"70px",height:"50px",marginTop:"10px"}}></img>
                    <h1 style={{ color: "white",marginTop:"6px"}}>ConvoSpace</h1>
                </div>
                <div className="buttons">
                    {/* <button className="button" onClick={() => setShowSignUp(!showSignUp)}>Signup</button>
                    <button className="button" onClick={() => setShowSignIn(!showSignIn)}>Signin</button> */}
                    <button className="button" onClick={showSignUp}>Signup</button>
                    <button className="button" onClick={showSignIn}>Signin</button>
                </div>
            </div>
            {/* signin <Signin></Signin>
      {/* {signup(<Signup></Signup>)} */}
        </div>
    );
}


