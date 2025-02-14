
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import "../style/Header.css"

export default function Header() {
    // const navigate = useNavigate();
    // function goToSignup() {
    //     navigate("/signup");
    // }

    // function goToSignin() {
    //     navigate("/login");
    // }
    return (
        <Router>
            <div>
                <div id="whole">
                    <h1 style={{color:"white",marginTop:"15px"}}>Meeting</h1>
                    <div className="buttons">
                        <Link to="/signup"><button className="button">Signup</button></Link>
                        <Link to="/login"><button className="button">Signin</button></Link>
                    </div>
                </div>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Signin />} />
                </Routes>
            </div>
        </Router>
    )
}


