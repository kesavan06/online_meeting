import { useRef, useState } from "react"
import { sendOffer } from "../ScreenShare";
import { startScreenShare } from "../ScreenShare";

export default function ShareScreen()
{
    const localVideoRef=useRef(null);
    const remoteVideoRef=useRef(null);
    const [isShare,setIsShare] = useState(false);

    const screenShare = async ()=>{
        const stream = await startScreenShare();
        if(stream)
        {
            localVideoRef.current.srcObject=stream;
            setIsShare(true);
            sendOffer();
        }
    }
    return(
        <>
            <div>
                <h1>You</h1>
                <video id="localVideo" ref={localVideoRef} autoPlay playsInline style={{width:"400px"}}></video>
            </div>
            <div>
                <h1>Remote</h1>
                <video id="remoteVideo" ref={remoteVideoRef} autoPlay playsInline style={{width:"400px"}}></video>
            </div>
            <button id="start" disabled={isShare} onClick={screenShare}>Start</button>
        </>
    )
}
