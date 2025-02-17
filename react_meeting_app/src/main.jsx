import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VideoBox from "./components/VideoBox.jsx";
import ChatParticipants from "./components/ChatParticipants.jsx";
import VideoRecord from "./components/VideoRecord.jsx";
import Footer from "./components/MeetingFooter.jsx";
import "./index.css";
import Meeting from "./components/Meeting.jsx";
import HomePage from "./components/HomePage.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import MeetingSetup from "./components/MeetingSetup.jsx";

createRoot(document.getElementById("root")).render(

  <StrictMode>
    <HomePage></HomePage>
    {/* <Meeting></Meeting> */}
  </StrictMode>
);
