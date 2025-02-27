
import { io } from "socket.io-client";
//const  = require("react")
// const { io } = require("socket.io-client");

// const socket=io("http://localhost:3444");

let peerConnection;
// let local=document.getElementById("localVideo");
// let start=document.getElementById("start");


const configuration = {
    'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]
}


export async function startScreenShare()
{
    console.log("Inside the share screen");
    peerConnection = new RTCPeerConnection(configuration);

    let screen=await navigator.mediaDevices.getDisplayMedia({video:true});
    // screen.getTracks().forEach((track)=>{
    //     peerConnection.addTrack(track,screen);
    // })

    // local.srcObject=screen;

    // peerConnection.ontrack=(event)=>{
    //     local.srcObject=event.streams[0];
    // };


    // peerConnection.ontrack=(event)=>{
    //     const remoteVideo=document.getElementById("remoteVideo");
    //     if(remoteVideo)
    //     {
    //         remoteVideo.srcObject=event.streams[0];
    //     }
    // };

    // peerConnection.onicecandidate=(event)=>{
    //     if(event.candidate){
    //         socket.emit("candidate",event.candidate);
    //     }
    // }
    return screen;
}

// export async function sendOffer(){
//     // startScreenShare();
//     console.log("Send offer");

//     const offer=await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);

//     socket.emit("offer",offer);
// }



// socket.on("offer",async (offer)=>{
//     peerConnection=new RTCPeerConnection(configuration);
//     peerConnection.ontrack=(event)=>{
//         local.srcObject=event.streams[0];
//     }

//     peerConnection.onicecandidate=(event)=>{
//         if(event.candidate)
//         {
//             socket.emit("candidate",event.candidate);
//         }
//     }

//     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer=await peerConnection.createAnswer();
//     await peer.setLocalDescription(answer);

//     socket.emit("answer",answer);
// })

// socket.on("answer",async(answer)=>{
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
// })

// socket.on("candidate",async (candidate)=>{
//     console.log("Received ICE candidate");

//     try{
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     }
//     catch(err)
//     {
//         console.log("Error: "+err);
//     }
// })

