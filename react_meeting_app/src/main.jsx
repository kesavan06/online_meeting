import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VideoBox from "./components/VideoBox.jsx";
import ChatParticipants from "./components/ChatParticipants.jsx";
import VideoRecord from "./components/VideoRecord.jsx";
import Footer from "./components/MeetingFooter.jsx";
import "./index.css";
import Meeting from "./components/Meeting.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Meeting></Meeting>
  </StrictMode>
);
