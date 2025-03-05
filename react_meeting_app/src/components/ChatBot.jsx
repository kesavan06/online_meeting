import { useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "../ChatBot.css";
export const ChatBot = ({ chatBotMessage, setChatBotMessage }) => {
  let prompt = useRef("");
  const chatBotMessageRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBotMessageRef.current) {
      chatBotMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [chatBotMessage]);

  const getResponse = async () => {
    const today = new Date();
    console.log(today.toLocaleString());

    let getTodayTime = today.toLocaleTimeString();
    let splitDay = getTodayTime.split(":");

    console.log("TIme : ", splitDay);

    let day =
      +splitDay[0] > 12
        ? +splitDay[0] - 12 + "." + splitDay[1] + " PM"
        : splitDay[0] + "." + splitDay[1] + " AM";

    if (splitDay[0] == 12) {
      day = splitDay[0] + "." + splitDay[1] + " PM";
    }

    // let day = splitDay[0].concat(
    //   ".",
    //   splitDay[1],
    //   " ",
    //   splitDay[2].slice(3).toUpperCase()
    // );
    
    let botPrompt = prompt.current.value;
    prompt.current.value = "";
    setChatBotMessage((prev) => {
      return [...prev, { message: botPrompt, time: day }];
    });
    let url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    let apiKey = "AIzaSyAnVf9v8wu_1JRPCPudoFpfT-Z5NKQY0wU";
    let response = await fetch(url + "?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Response must with in a 1 to 20 lines:" + botPrompt,
              },
            ],
          },
        ],
      }),
    });
    let data = await response.json().then((data) => data);
    console.log(data);
    let message = data.candidates[0].content.parts[0].text;
    setChatBotMessage((prev) => {
      return [...prev, { message: message, time: day }];
    });
  };

  return (
    <div className="chatBot">
      <div className="chatBotDisplay">
        {chatBotMessage.map((messages, index) => {
          return (
            <div
              className={
                index % 2 == 0 ? "chatBotThread right" : "chatBotThread"
              }
              key={index}
            >
              <div className="userDetail">
                <p id="name">{index % 2 == 0 ? "You" : "Bot"}</p>
                <p id="time">{messages.time}</p>
              </div>
              <div className="messages">
                <p className="messagePara">{messages.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatBotMessageRef} />
      </div>

      <div className="chatBotSentBox">
        <div className="chatBotSentInputBox">
          <input
            ref={prompt}
            type="text"
            placeholder="Enter your prompt..."
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                if (prompt.current.value.trim().length != 0) {
                  getResponse();
                }
              }
            }}
          ></input>

          <button
            onClick={() => {
              if (prompt.current.value.trim().length != 0) {
                getResponse();
              }
            }}
          >
            <FaPaperPlane className="invert"></FaPaperPlane>
          </button>
        </div>
      </div>
    </div>
  );
};
