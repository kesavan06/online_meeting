import "../BreakOutRoomPopup.css";
import { FaXmark } from "react-icons/fa6";
import { useAppContext } from "../Context";
import { useState, useRef, useEffect } from "react";
export const BreakOutRoomPopup = ({
  setBreakOutRoom,
  showChatBox,
  bRoomArray,
  setBRoomArray,
  setShowBreakOutRoom,
  setShowMeeting,
  joinBreakoutRoom,
  onScreenShare,
}) => {
  const {
    socketRef,
    roomId,
    breakoutRoomStream,
    setBreakoutRoomStream,
    addBreakoutRoomStream,
    streams,
    setStreamsState,
  } = useAppContext();
  const bRoomName = useRef("");
  useEffect(() => {
    if (socketRef.current.isHost) {
      bRoomName?.current?.focus();
    }
  }, []);

  const createBreakoutRoom = () => {
    let roomName = bRoomName.current.value;
    bRoomName.current.value = "";
    if (roomName.trim() === "") return;
    if (bRoomArray.includes(roomName)) {
      bRoomName.current.placeholder = "Room already exists";
      return;
    }
    bRoomName.current.placeholder = "Enter Room name";
    socketRef.current.emit("showBreakoutRooms", roomName, roomId.current);
  };

  const removeBreakoutRoom = (indexOfRoom) => {
    console.log("delete index: ", indexOfRoom);
    socketRef.current.emit("remove-breakout-room", roomId.current, indexOfRoom);
  };

  return (
    <div
      className={
        showChatBox
          ? "breakoutContainer"
          : onScreenShare.current
          ? "breakoutContainer2"
          : "breakoutContainer1"
      }
    >
      <div className="breakoutHeading">
        <div className="breakOutRoomName">
          <p>Breakout Rooms</p>
        </div>
        <div
          className="closeBreakout"
          onClick={() => {
            setBreakOutRoom((prev) => (prev = false));
          }}
        >
          <FaXmark className="closePopup"></FaXmark>
        </div>
      </div>
      <div className="roomNameDiv">
        {bRoomArray.map((room, index) => {
          return (
            <div className="bRoomName" key={index}>
              <p>{room}</p>
              <div
                className={
                  socketRef.current.isHost ? "bRoomControl" : "bRoomControl2"
                }
              >
                {socketRef.current.isHost && (
                  <button
                    className="bRoomDeleteBtn"
                    onClick={() => {
                      removeBreakoutRoom(index);
                    }}
                  >
                    <FaXmark></FaXmark>
                  </button>
                )}
                <button
                  className="bRoomJoinBtn"
                  onClick={() => {
                    joinBreakoutRoom();
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {socketRef.current.isHost && (
        <div className="bRoomAddBtn">
          <input
            type="text"
            placeholder="Enter Room name"
            ref={bRoomName}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                createBreakoutRoom();
              }
            }}
          ></input>
          <button
            onClick={() => {
              createBreakoutRoom();
            }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};
