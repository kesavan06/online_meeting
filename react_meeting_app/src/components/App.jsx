import { useEffect, useState, useRef } from "react";
import HomePage from "./HomePage";
import Meeting from "./Meeting";
import "../App.css";
import { AppProvider, useAppContext } from "../Context";
import axios from "axios";
import PollCreater from "./PollCreater";

const App = () => {
  return (
    <AppProvider className="wrapper">
      <HomePage></HomePage>
    </AppProvider>
  );
};

export default App;
