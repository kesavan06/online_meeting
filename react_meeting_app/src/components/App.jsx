import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import Meeting from "./Meeting";
import "../App.css";
import { createContext } from "react";
import AppProvider from "../Context";
import axios from "axios";

const BACKEND_SERVER_URL = "http://localhost:3007";
function App() {
  useEffect(() => {
    axios
      .get(BACKEND_SERVER_URL)
      .then((response) => {
        console.log("Received:", response.data.message);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <AppProvider className="wrapper">
      <HomePage></HomePage>
      {/* <Meeting></Meeting> */}
    </AppProvider>
  );
}

export default App;
