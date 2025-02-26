import VideoRecord from "./VideoRecord";
import VideoBox from "./VideoBox";
import ChatParticipants from "./ChatParticipants";
import MeetingFooter from "./MeetingFooter";
import { useState, useEffect, useRef } from "react";
import WhiteBoard from "./WhiteBoard";
import EmojiPicker from 'emoji-picker-react';

import "../Meeting.css";
import { useAppContext } from "../Context";

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

function Meeting() {
  // let {videoGridRed} = useAppContext();

  const { socketRef, user_name } = useAppContext();
  const [showWhiteBoard, setShowWhiteBoard] = useState(false);
  const [showChatBox, setShowChatBox] = useState(true);
  const [chatView, setChatView] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [allEmoji, setAllEmoji] = useState([]);

  const { roomId, streams, myStream, screenStream, startScreenShare } = useAppContext();

  console.log("all streams: ", streams);


  const screenVideoRef = useRef(null);
  function handleWhiteBoardShow() {
    setShowWhiteBoard(!showWhiteBoard);
  }
  useEffect(() => {
    if (screenVideoRef.current && streams) {
      console.log(screenStream);
      streams.map((videoStream) => {
        if (videoStream.type == "screen")
          screenVideoRef.current.srcObject = videoStream.stream;
        screenVideoRef.current.play().catch((err) => {
          console.error("Error playing screen stream:", err);
        });
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
    console.log("EMoji : ", emojiObject.emoji)
    let emoji = emojiObject.emoji;
    socketRef.current.emit("emojiSend", (emoji));

    setShowEmojis((prev) => prev = !prev)
  }

  useEffect(() => {
    console.log("All EMoji : ", allEmoji);

  }, [allEmoji])


  useEffect(() => {


    function handleEmoji({ emoji, name }) {

      console.log("Emoji Received: ", emoji);
      console.log("Socket id : ",user_name.current == name);
      let emojiName = user_name.current == name;
      console.log("User name : ",user_name.current);

      const id = Date.now();
      setAllEmoji((prev) => [...prev, { id, emoji, name: emojiName ? "you" : name }]);


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
      <div className="meetingHeaderBox">
        <div className="meetingHeader">
          <VideoRecord></VideoRecord>
          <p style={{ color: "white" }}>Meeting ID: {roomId.current}</p>
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
                      showWhiteBoard={showWhiteBoard}
                      type={videoStream.type}
                    ></VideoComponent>
                  );
                }
              })}
          </div>
          <div className="mainVideoBox">
            {
              <video
                ref={screenVideoRef}
                className="shareScreenElement"
                autoPlay
              ></video>
            }

            {showEmojis &&
              <div className="emoji">
                <EmojiPicker
                  theme="dark"
                  width={300}
                  height={400}
                  emojiStyle="native"
                  categories={[
                    { name: 'Smileys & Emotion', category: 'smileys_people' },
                  ]}
                  open={showEmojis}
                  onEmojiClick={handleClickOnEmoji}
                />
              </div>
            }

            {allEmoji.map(({ id, emoji, name }) => {
              return (

                <span className="emojiDiv" id={id}>
                  <p style={{fontSize : "1rem", textAlign: "center"}}>{name}</p>
                  {emoji}
                </span>)
            })}


          </div>

          <div className="whiteBoardBox">
            {showWhiteBoard && (
              <WhiteBoard controlBoard={handleWhiteBoardShow} />
            )}
          </div>
        </div>
        {showChatBox && (
          <div className="meetingChatParticipants">
            <ChatParticipants
              setShowChatBox={setShowChatBox}
              chatView={chatView}
              setChatView={setChatView}
            ></ChatParticipants>
          </div>
        )}
      </div>
      <div className="meetingFooter">
        <MeetingFooter
          setShowChatBox={setShowChatBox}
          handleBoard={handleWhiteBoardShow}
          chatView={chatView}
          setChatView={setChatView}
          startScreenShare={startScreenShare}
          showEmojis={showEmojis}
          setShowEmojis={setShowEmojis}
        ></MeetingFooter>{" "}
      </div>
    </div>
  );
}

export default Meeting;








