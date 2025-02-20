import { useEffect, useState, useRef } from "react";
import HomePage from "./HomePage";
import Meeting from "./Meeting";
import "../App.css";
import { AppProvider, useAppContext } from "../Context";
import axios from "axios";
import PollCreater from "./PollCreater";

const App = () => {
  const [roomId, setRoomId] = useState(null);
  return (
    <div className="wrapper">
      {!roomId ? (
        <HomePage setRoomId={setRoomId}></HomePage>
      ) : (
        <Meeting roomId={roomId}></Meeting>
      )}
    </div>
  );
};

export default App;
