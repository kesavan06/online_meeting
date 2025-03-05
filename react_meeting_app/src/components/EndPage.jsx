import { FaClock } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import "./EndPage.css"

export default function EndPage()
{
    return(
        <div id="endPage">
            <h2 id="endTitle">Thank you for hosting!</h2>
            <div id="meetingEndDetails">
                <div className="wholeDetails">
                    <div className="meetingIcon">
                        <span style={{fontSize:"19px",fontWeight:"bold"}}>V</span>
                    </div>
                    <div className="moreDetail">
                        <label>Host</label>
                        <label>Vennila K</label>
                    </div>
                </div>
                <div className="wholeDetails">
                    <div className="meetingIcon">
                        <span><FaClock className="originalIcon"></FaClock></span>
                    </div>
                    <div className="moreDetail">
                        <label>Session duration</label>
                        <label>5 minutes</label>
                    </div>
                </div>
                <div className="wholeDetails">
                    <div id="peoples">
                        <MdPeopleAlt className="originalIcon"></MdPeopleAlt>
                    </div>
                    <div className="moreDetail">
                        <label>Participant</label>
                        <label>1</label>
                    </div>
                </div>
            </div>
            <div id="activities">
                <span>Session Activities</span>
                <div id="activity">
                    <div id="chat">
                        <FaMessage className="originalIcon"></FaMessage>
                        <p>Chat</p>
                    </div>
                    <div id="notes">
                        <FaBook className="originalIcon"></FaBook>
                        <p>Notes</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

