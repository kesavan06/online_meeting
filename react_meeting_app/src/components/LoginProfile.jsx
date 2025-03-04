import { useState } from "react";
import "../LoginProfileStyle.css";

function LoginProfile({ cookie, handleLogOut, setHistory }) {
    console.log("Cookie : ", cookie);
    const [showDetails, setShowDetails] = useState(false);


    function handleClickProfile() {
        setShowDetails((prev) => !prev);
    }

    function handleMeetingHistory() {
        setHistory(prev => prev = !prev);
    }


    return (
        <>
            <div className="loginProfile" onClick={() => handleClickProfile()} onBlur={handleClickProfile} tabIndex="0" >
                {cookie.user_name[0].toUpperCase()}
            </div>

            {showDetails ? (
                <div className="details">

                    <p onClick={() => handleMeetingHistory()}>meetings</p>
                    <p onClick={() => handleLogOut()} style={{ textAlign: "center", width: "100%" }}>Logout</p>
                </div>
            ) : null}
        </>
    )
}

export default LoginProfile;