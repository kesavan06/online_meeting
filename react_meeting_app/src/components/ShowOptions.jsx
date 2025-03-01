import { useEffect } from "react";
import { useAppContext } from "../Context";
import "../Option.css"


export default function ShowOptions({ parArray , isPrivate}) {

    useEffect(() => {
        console.log("Par Array : ", parArray, roomId.current);
    }, [])

    const { socketRef, roomId, toSocket } = useAppContext();

    function handleChange(e) {
        console.log("Event triggered : ",e);
        console.log("Changed to : ",e.target.value);

        let userId = e.target.value;

        let selectedUser = parArray.find(user => user.socketId === userId);

        if (selectedUser) {

            isPrivate.current = true;
            console.log("Selected User:", selectedUser.name, "Socket ID:", userId);

            toSocket.current = userId;
            toSocket.name = selectedUser.name;

        } else {
            isPrivate.current = false;
            console.log("Everyone selected ", "Socket ID:", userId);
        }
    }


    return (
        <select onChange={(e) => handleChange(e)} className="selectUser">
            <option key={roomId} value={roomId.current}>Everyone</option>
            {parArray.filter(({ socketId }) => socketId !== socketRef.current.id).map(({ name, socketId }) => {
                return (
                    <option key={socketId} value={socketId}>{name}</option>
                )
            })
            }
        </select>

    )
}