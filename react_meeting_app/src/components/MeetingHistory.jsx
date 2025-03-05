import { useState } from "react";
import "../History.css";
import Profile from "./Profile";
import { WiSunrise } from "react-icons/wi";
import { MdBrightnessLow } from "react-icons/md";
import { MdBrightnessMedium } from "react-icons/md";
import { FaCloudSun } from "react-icons/fa";
import { RiMoonClearFill } from "react-icons/ri";
import { IoIosChatboxes } from "react-icons/io";
import { CgNotes } from "react-icons/cg";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

export default function MeetingHistory({setHistory}) {


    const [array, setArray] = useState([{ time: "12.20PM", user_name: "Deepa", note: " ", chat: ["deepa : hi", "user2 : hello"] }]);
    // const [time, setTime] = useState([<WiSunrise />, <MdBrightnessLow />, <MdBrightnessMedium />, <FaCloudSun />, <RiMoonClearFill />])

    let timeNow = new Date();
    let t = (timeNow.toLocaleTimeString());
    console.log(t);

    function getTimeIcon(time) {
        let tN;
        // console.log("Time : ", t);
        if (time.endsWith("AM")) {
            tN = (+t.slice(0, 2));

            // console.log(t.slice(0, 2));

            if (tN > 5) {
                return <MdBrightnessLow />
            }
            else {
                return <WiSunrise />;
            }
        }
        else {
            tN = (+t.slice(0, 2)) - 12;
            // console.log("T n : ", tN);

            if (tN < 2) {
                return <MdBrightnessMedium />
            }

            if (tN > 5) {
                return <RiMoonClearFill />
            }
            else {
                return <FaCloudSun />;
            }

        }
    }

    function handleLeave(){
        setHistory(prev=> !prev);
    }


    return (
        <>
            <div className="historyParent">meetings
                <div onClick={handleLeave} className="leave">
                    <MdOutlineCancel />
                </div>

                {array.map((meeting) => {
                    return (
                        <div className="meetingDetail">
                            <div className="timeManage">
                                <div className="timeIcon">
                                    {getTimeIcon(meeting.time)}
                                </div>
                                <p>{meeting.time}</p>
                            </div>

                            <div className="userName">
                                <p>{meeting.user_name}'s meeting</p>
                            </div>

                            <div className="proParent">
                                <Profile firstLetter={meeting.user_name[0]} show={false}></Profile>
                                {meeting.user_name}
                            </div>


                            <div className="chatAnoteDowload">
                                <div className="flex" style={{ justifyContent: "right" }}>
                                    <IoIosChatboxes style={{ fontSize: "1.6rem" }} /> Chat
                                </div>
                                <div className="flex">
                                    <CgNotes style={{ fontSize: "1.6rem" }} /> Notes
                                </div>
                                <div className="flex">
                                    <FaChalkboardTeacher style={{ fontSize: "1.6rem" }} /> White Board
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
        </>
    )
}