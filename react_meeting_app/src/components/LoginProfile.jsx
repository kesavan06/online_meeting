import { useEffect, useState } from "react";
import "../LoginProfileStyle.css";
import ShowMessage from "./ShowMessages";

function LoginProfile({ cookie, handleLogOut, setHistory }) {
    console.log("Cookie : ", cookie);
    const [showDetails, setShowDetails] = useState(false);


    function handleClickProfile() {
        setShowDetails((prev) => !prev);
    }

    function handleMeetingHistory() {
        setHistory(prev => prev = true);
    }

    return (
        <>
            <div className="loginProfile" onClick={() => handleClickProfile()} tabIndex="0" style={{cursor: "pointer"}} >
                {cookie.user_name[0].toUpperCase()}
            </div>

            {showDetails ? (
                <div className="details" onBlur={handleClickProfile}>
                    <p onClick={() => handleLogOut()} style={{ textAlign: "center", width: "100%" }}>Log out</p>
                    <p onClick={() => handleMeetingHistory()}>meetings</p>
                </div>
            ) : null}
        </>
    )
}

export default LoginProfile;