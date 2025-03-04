import Feature from "./Feature";
import { FaVideo } from "react-icons/fa";
// import {FaShareNodes} from "react-icons/fa"

import { FaPenNib } from "react-icons/fa";
import React from "react";
import "../FeatureList.css";
function FeatureList({ displayParent, displayScreenShare }) {
  const features = [
    {
      src: "video_on.svg",
      title: "HD Video Conferencing",
      content: "Crystal clear video and audio for seamless communication",
    },
    {
      src: "chat_1.svg",
      title: "Integrated Chat",
      content: "Real-time messaging during meetings for enhanced collaboration",
    },
    {
      src: "share_2.svg",
      title: "Screen Sharing",
      content:
        "Share your screen effortlessly for presentations and demonstrations",
    },
    {
      src: "pen.svg",
      title: "Interactive Whiteboard",
      content: "Collaborate in real-time with a shared digital whiteboard",
    },
    {
      src: "circle-play-regular.svg",
      title: "Video Capture",
      content:
        "Never miss key moments—record and playback your meetings whenever needed.",
    },
  ];

  return (
    <>
      <div className="featureListContainer">
        {features.map((feature, index) => {
          return (
            <Feature
              key={index}
              src={feature.src}
              title={feature.title}
              content={feature.content}
              white={feature.onClick}
            />
          );
        })}
      </div>
    </>
  );
}

export default FeatureList;
