import "../BreakOutRoomPopup.css";
import { FaXmark } from "react-icons/fa6";
export const BreakOutRoomPopup = ({ setBreakOutRoom }) => {
  return (
    <div className="breakoutContainer">
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
      <div className="roomNameDiv"></div>
    </div>
  );
};
