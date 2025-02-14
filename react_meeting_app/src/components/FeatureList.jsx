import Feature from "./Feature"
import { FaVideo } from "react-icons/fa"
// import {FaShareNodes} from "react-icons/fa"
import { FaPenNib } from "react-icons/fa"
import React from "react"
function FeatureList()
{
    const features=[
        {src:"video_on.svg",title:"HD Video Conferencing",content:"Crystal clear video and audio for seamless communication"},
        {src:"chat_1.svg",title:"Integrated Chat",content:"Real-time messaging during meetings for enhanced collaboration"},
        {src:"share_2.svg",title:"Screen Sharing",content:"Share your screen effortlessly for presentations and demonstrations"},
        {src:"pen.svg",title:"Interactive Whiteboard",content:"Collaborate in real-time with a shared digital whiteboard"}
    ]
    return(
        <center>
            <div style={{width:"46%",height:"630px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",marginTop:"50px"}}>
                {
                    features.map((feature)=>{
                        return(
                            <Feature src={feature.src} title={feature.title} content={feature.content}/>
                        )
                        
                    })
                }
            </div>
        </center>
    )
}

export default FeatureList;