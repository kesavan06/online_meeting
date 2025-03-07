import { useEffect, useRef, useState } from "react";
import "../Participants.css";
import Profile from "./Profile";
import { MdEditSquare } from "react-icons/md";
import { useAppContext } from "../Context";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkCircleSharp } from "react-icons/io5";



export default function ShowParticipant({ name, socketId, allParticipants, host }) {

    const [userName, setUserName] = useState(name);

    const [editName, setEditName] = useState(false);
    const [showEdid, setShowEdit] = useState(false);

    const nameOfUser = useRef();
    const { user_name, socketRef, roomId } = useAppContext();

    console.log("Is a host in : ", host);

    async function handleNameChange() {

        console.log("1");
        console.log("User name 1: ", nameOfUser.current.innerText, name);

        if (nameOfUser.current.innerText != "") {
            console.log(2);

            user_name.current = nameOfUser.current.innerText;

            console.log("User name Now: ", nameOfUser.current.innerText);
            console.log("name ", name);

            changeName(user_name.current, roomId.current, socketRef.current.id)

            console.log("INside:  ", name, user_name.current);
            console.log("Socket id : ", socketId, socketRef.current.id);

            name = user_name.current;
            setUserName(nameOfUser.current.innerText);

            setEditName((prev) => !prev);
        }


    }

    function handleEditing() {
        setEditName((prev) => !prev)
    }


    useEffect(() => {
        console.log("Edit : ", editName, userName);
    }, [editName])

    useEffect(() => {

        console.log("ALl users : ", allParticipants);
        if (socketRef.current.id == socketId) {
            setShowEdit((prev) => prev = true);
        }

    }, [])


    return (
        <div className="name">
            <div className="participantProfile">
                <Profile firstLetter={userName[0].toUpperCase() } />
                <p ref={nameOfUser} contentEditable={editName} tabIndex={0} style={{ cursor: editName ? "text" : "default" }} className="userName">{userName} </p>
                {host && <span style={{ fontSize: "0.75rem", position : "absolute", top: "36%", left : "50%"}}>(host)</span>}
            </div>
            {showEdid && !editName && <MdEditSquare style={{ alignSelf: "right", cursor: "pointer" }} onClick={() => handleEditing()} />}
            {showEdid && editName && <IoCheckmarkCircleSharp style={{ alignSelf: "right", cursor: "pointer" }} onClick={() => handleNameChange()} />}

        </div>
    )
}


async function changeName(name, roomId, socketId) {
    let fetchCall = await fetch("https://10.89.72.171:3002/changeName", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, roomId, socketId })
    })
}