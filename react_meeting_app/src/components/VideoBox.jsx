import { FaMicrophoneSlash } from "react-icons/fa";
import "../VideoBox.css";
function VideoBox() {
  return (
      <div style={{}} className="videoBox">
        <div className="disableMic">
          <FaMicrophoneSlash className="mic"></FaMicrophoneSlash>
        </div>
        <p>Kesavan</p>
      </div>
  );
}

export default VideoBox;
