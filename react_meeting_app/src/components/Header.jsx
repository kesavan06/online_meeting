import Signin from "./Signin";
import Signup from "./Signup";
import "../Header.css";

export default function Header() {
  return (
    <div>
      <div id="whole">
        <h1 style={{ color: "white", marginTop: "15px" }}>MeetSync</h1>
        <div className="buttons">
          <button className="button">Signup</button>
          <button className="button">Signin</button>
        </div>
      </div>
    </div>
  );
}
