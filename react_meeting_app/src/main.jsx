import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VideoBox from "./components/VideoBox.jsx";
import ChatParticipants from "./components/ChatParticipants.jsx";
import VideoRecord from "./components/VideoRecord.jsx";
import Footer from "./components/Footer.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="meetingContainer">
      <VideoBox></VideoBox>
      <ChatParticipants></ChatParticipants>
      <VideoRecord></VideoRecord>
      <Footer></Footer>
    </div>
  </StrictMode>
);
