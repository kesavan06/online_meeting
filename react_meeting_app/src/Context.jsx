import { createContext, useContext, useState, useEffect, useRef } from "react";
// import { socket, connectSocket, disconnectSocket, sendMessage } from "./socket";
import { io } from "socket.io-client";

import Peer from "peerjs";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  return <AppContext.Provider>{children}</AppContext.Provider>;
};
