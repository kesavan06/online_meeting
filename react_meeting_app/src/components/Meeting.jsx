import VideoRecord from "./VideoRecord";
import VideoBox from "./VideoBox";
import ChatParticipants from "./ChatParticipants";
import MeetingFooter from "./MeetingFooter";
import { useState, useEffect, useRef } from "react";
import WhiteBoard from "./WhiteBoard";
import EmojiPicker from "emoji-picker-react";

import { createRoot } from "react-dom/client";
import "../Meeting.css";
import { useAppContext } from "../Context";
import Wrapper from "./Wrapper";
import PollCreater from "./PollCreater";
import { FaCopy } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { BreakOutRoomPopup } from "./BreakOutRoomPopup";

const VideoComponent = ({ stream, isLocalStream, showWhiteBoard, type }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log("Setting stream to video element:", stream.id);
      console.log(stream);
      videoRef.current.srcObject = stream;

      videoRef.current.onloadmetadata = () => {
        video.current.play().catch((err) => {
          console.log("Error playing video: ", err);
        });
      };
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={!showWhiteBoard ? "video" : "upVideo"}
      autoPlay
      playsInline
      muted={isLocalStream}
      style={{ cursor: "pointer" }}
      disablePictureInPicture
    ></video>
  );
};

function Meeting({
  showMeeting,
  setShowMeeting,
  setShowSignIn,
  setShowSignUp,
  setViewJoinMeeting,
  setViewSetupMeeting,
  setDisplayParent,
}) {
  // let {videoGridRed} = useAppContext();

  // const [showWhiteBoard, setShowWhiteBoard] = useState(false);
  const [showChatBox, setShowChatBox] = useState(true);
  let [chatView, setChatView] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [allEmoji, setAllEmoji] = useState([]);
  let [isPoll, setIsPoll] = useState(false);
  let [allMessage, setAllMessage] = useState([]);

  const [participantLength, setParticiapantLength] = useState(0);
  const [leaveMeeting, setLeaveMeeting] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const [breakOutRoom, setBreakOutRoom] = useState(false);

  const [chatBotMessage, setChatBotMessage] = useState([]);

  const copyRoomId = async (roomId) => {
    await navigator.clipboard.writeText(roomId);
    setCopyText(true);
  };
  const copyComponent = () => {
    if (copyText) {
      return setTimeout(() => {
        <FaCheck></FaCheck>;
      }, 1000);
    } else {
      return <FaCopy></FaCopy>;
    }
  };

  const openPopup = () => {
    const newWindow = window.open("", "_blank", "width=1000,height=700");
    newWindow.document.title = "Kadhaikalaam - whiteboard";

    if (newWindow) {
      const style = newWindow.document.createElement("style");
      style.innerHTML = `
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: white;
        }`;

      newWindow.document.head.appendChild(style);

      newWindow.document.body.innerHTML = "<div id='popup-root'></div>";

      const popupRoot = newWindow.document.getElementById("popup-root");

      if (popupRoot) {
        const root = createRoot(popupRoot);
        root.render(<WhiteBoard />);
      }
    }
  };

  const {
    roomId,
    streams,
    myStream,
    screenStream,
    startScreenShare,
    socketRef,
    user_name,
    pauseAudio,
    pauseVideo,
  } = useAppContext();

  console.log("all streams: ", streams);

  const screenVideoRef = useRef(null);
  // function handleWhiteBoardShow() {
  //   // setShowWhiteBoard(!showWhiteBoard);
  // }
  useEffect(() => {
    if (screenVideoRef.current && streams) {
      console.log(screenStream);
      streams.map((videoStream) => {
        if (videoStream.type == "screen")
          screenVideoRef.current.srcObject = videoStream.stream;
      });
    } else if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
  }, [streams]);

  useEffect(() => {
    console.log("Current streams:", streams);
  }, [streams]);

  function handleClickOnEmoji(emojiObject) {
    console.log("Emoji : ", emojiObject);
    console.log("EMoji : ", emojiObject.emoji);
    let emoji = emojiObject.emoji;
    socketRef.current.emit("emojiSend", emoji);

    setShowEmojis((prev) => (prev = !prev));
  }

  useEffect(() => {
    console.log("All EMoji : ", allEmoji);
  }, [allEmoji]);

  useEffect(() => {
    function handleEmoji({ emoji, name }) {
      console.log("Emoji Received: ", emoji);
      console.log("Socket id : ", user_name.current == name);
      let emojiName = user_name.current == name;
      console.log("User name : ", user_name.current);

      const id = Date.now();
      setAllEmoji((prev) => [
        ...prev,
        { id, emoji, name: emojiName ? "you" : name },
      ]);

      setTimeout(() => {
        setAllEmoji((prev) => prev.filter((e) => e.id !== id));
      }, 4400);
    }
    socketRef.current.on("showEmoji", handleEmoji);

    return () => {
      socketRef.current.off("showEmoji");
    };
  }, []);

  return (
    <div className="meetingContainer">
      {isPoll && (
        <Wrapper>
          <PollCreater
            allMessage={allMessage}
            setAllMessage={setAllMessage}
            isPoll={isPoll}
            setIsPoll={setIsPoll}
          ></PollCreater>
        </Wrapper>
      )}
      <div className="meetingHeaderBox">
        <div className="meetingHeader">
          <VideoRecord></VideoRecord>
          <p
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Meeting ID: {roomId.current}
            {}
            <FaCopy
              onClick={() => copyRoomId(roomId.current)}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            ></FaCopy>
          </p>
        </div>
      </div>

      <div className="meetingContent">
        <div className={showChatBox ? "meetingVideoBox" : "meetingVideoBox1"}>
          <div className="videoBoxes">
            {streams != null &&
              streams.map((videoStream) => {
                if (videoStream.type == "camera") {
                  return (
                    <VideoComponent
                      key={videoStream.stream.id}
                      stream={videoStream.stream}
                      isLocalStream={
                        videoStream.stream.id === myStream?.current?.id
                      }
                      // showWhiteBoard={showWhiteBoard}
                      type={videoStream.type}
                    ></VideoComponent>
                  );
                }
              })}
          </div>
          <div className="mainVideoBox">
            {streams.some((videoStream) => videoStream.type == "screen") && (
              <video
                ref={screenVideoRef}
                className="shareScreenElement"
                autoPlay
              ></video>
            )}

            {showEmojis && (
              <div className="emoji">
                <EmojiPicker
                  theme="dark"
                  width={300}
                  height={400}
                  emojiStyle="native"
                  categories={[
                    { name: "Smileys & Emotion", category: "smileys_people" },
                  ]}
                  open={showEmojis}
                  onEmojiClick={handleClickOnEmoji}
                />
              </div>
            )}
            {breakOutRoom && (
              <BreakOutRoomPopup
                setBreakOutRoom={setBreakOutRoom}
              ></BreakOutRoomPopup>
            )}
            {allEmoji.map(({ id, emoji, name }) => {
              return (
                <span className="emojiDiv" id={id}>
                  <p style={{ fontSize: "1rem", textAlign: "center" }}>
                    {name}
                  </p>
                  {emoji}
                </span>
              );
            })}
          </div>
        </div>
        {showChatBox && (
          <div className="meetingChatParticipants">
            <ChatParticipants
              setShowChatBox={setShowChatBox}
              chatView={chatView}
              setChatView={setChatView}
              setIsPoll={setIsPoll}
              isPoll={isPoll}
              allMessage={allMessage}
              setAllMessage={setAllMessage}
              setParticiapantLength={setParticiapantLength}
              showMeeting={showMeeting}
              showChatBot={showChatBot}
              setShowChatBot={setShowChatBot}
              showParticipants={showParticipants}
              setShowParticipants={setShowParticipants}
              chatBotMessage={chatBotMessage}
              setChatBotMessage={setChatBotMessage}
            ></ChatParticipants>
          </div>
        )}
      </div>
      <div className="meetingFooter">
        <MeetingFooter
          setShowChatBox={setShowChatBox}
          // handleBoard={handleWhiteBoardShow}
          chatView={chatView}
          setChatView={setChatView}
          startScreenShare={startScreenShare}
          openPopup={openPopup}
          setShowEmojis={setShowEmojis}
          participantLength={participantLength}
          breakOutRoom={breakOutRoom}
          setBreakOutRoom={setBreakOutRoom}
          showParticipants={showParticipants}
          setShowParticipants={setShowParticipants}
          showChatBot={showChatBot}
          setShowChatBot={setShowChatBot}
          setShowSignIn={setShowSignIn}
          setShowSignUp={setShowSignUp}
          setViewJoinMeeting={setViewJoinMeeting}
          setViewSetupMeeting={setViewSetupMeeting}
          setDisplayParent={setDisplayParent}
          setShowMeeting={setShowMeeting}
        ></MeetingFooter>
      </div>
    </div>
  );
}

export default Meeting;
