import { createContext, useContext, useState, useEffect, useRef } from "react";
import { socket, connectSocket, disconnectSocket, sendMessage } from "./socket";
import Peer from "peerjs";
const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [createMeeting, setCreateMeeting] = useState(false);
  const [joinMeeting, setJoinMeeting] = useState(false);
  let videoGridRef = useRef(null);
  let myVideo = useRef(null);
  let roomId = useRef(null);
  let peer = useRef(null);

  const [viewVideo, setViewVideo] = useState("");
  useEffect(() => {
    connectSocket();
  });

  return (
    <AppContext.Provider
      value={
        (createMeeting,
        setCreateMeeting,
        joinMeeting,
        setJoinMeeting,
        viewVideo,
        setViewVideo,
        videoGridRef,
        myVideo)
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
