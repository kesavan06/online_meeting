import { useRef, useState } from "react";
import "../Signup.css";
import { IoIosEye } from "react-icons/io";
import { RiEyeCloseFill } from "react-icons/ri";
import useUniqueName from "./UniqueCheck";
import { useAppContext } from "../Context";
import SignUp from "./SignUp";


function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (password.length < minLength) return { status: false, message: "Password must be at least 8 characters." };
    if (!hasUpperCase) return { status: false, message: "Password must have at least one uppercase letter." };
    if (!hasLowerCase) return { status: false, message: "Password must have at least one lowercase letter." };
    if (!hasNumber) return { status: false, message: "Password must contain at least one number." };
    if (!hasSpecialChar) return { status: false, message: "Password must include a special character (@$!%*?&)." };

    return { status: true, message: "Password is Strong!" };
}




function Signup(probs) {
    // const dialogRef=useRef(null);
    // if(probs.showSignUp)
    // {
    //     dialogRef.current.open();
    // }
    // if(!probs.showSignUp)
    // {
    //     dialogRef.current.close();
    // }
    const [showPass, setShowPass] = useState(false);

    let [messageUnique, setMessage] = useState("");
    const [showPassMessage, setShowPassMess] = useState("");
    const [samePassMessage, setSamePassMessage] = useState("");

    // let []
    const [showM, setM] = useState(false);
    const [isStrongPass, setIsStrongPass] = useState(false);
    const [isSamePass, setSamePass] = useState(false);


    // const signUPFunction = probs.signUpFunction;


    const { name, setName } = probs;
    const { nameUnique, setNameUnique } = probs;
    const { password, setPassword } = probs;

    const [passFirst, setPassFirst] = useState("");
    const { socketRef } = useAppContext();

    function cancelSignUp() {
        probs.setShowSignUp(false);
    }

    function showSignIn() {
        probs.setShowSignIn(true);
        probs.setShowSignUp(false);
    }

    function signUp(event) {
        event.preventDefault()

        if (passFirst != password) {

            setSamePass(false);
            setSamePassMessage("Your confirm password must match the original password");
        }
        else {
            setSamePass(true);
            setSamePassMessage("✅ Password confirmed!");
            console.log(name, password, nameUnique);

            if (name != "" && password != "" && nameUnique != "") {
                let signupUser =SignUp(name, password, nameUnique)
                console.log(signupUser);
            }
            else{
                console.log("Enter all the required datas");
            }

        }

    }

    function handlePassShow() {
        setShowPass(!showPass);
    }

    async function checkUnique(unique) {
        console.log("Unique: ", unique);
        let uniqueness = await useUniqueName(unique, socketRef);
        console.log("uniqueNess: ", uniqueness);
        if (uniqueness) {
            setM(true);
            setMessage("Username is valid and ready to use");
        }
        else {
            setM(false);
            setMessage("This username is already taken. Try another.");
        }
    }

    async function checkPassword(pass) {
        console.log("F Pass: ", pass);

        let passCheck = validatePassword(pass);

        if (passCheck.status) {
            setIsStrongPass(true);
            setShowPassMess(passCheck.message);
        }
        else {
            setIsStrongPass(false);
            setShowPassMess(passCheck.message);
        }
    }


    return (

        <div style={{ width: "100%", height: "100%" }}>

            <form id="signUp">
                <h1 style={{ color: "white" }}>Create your account</h1>
                <p style={{ color: "rgb(159 163 166 / 88%)" }}>Already have an account? <span style={{ color: "#7C3AED", cursor: "pointer" }} onClick={showSignIn}>Sign in</span></p>

                <div className="parent">
                    <label className="labelTag">User name
                        <input type="text" name="userName" autoComplete="off" className="inputTag" onChange={(e) => setNameUnique(e.target.value)} onBlur={() => checkUnique(nameUnique)} required />
                    </label>
                    <p className="messageToShow" style={{ color: !showM ? "red" : "green" }}>{messageUnique}</p>

                </div>


                <div className="parent">
                    <label className="labelTag">Name
                        <input type="text" name="name" autoComplete="off" className="inputTag" onChange={(e) => setName(e.target.value)} required />
                    </label>

                </div>


                <div className="parent">
                    <label className="labelTag">Password
                        <div className="passwordShow">
                            <input type={!showPass ? "password" : "text"} autoComplete="off" className="inputTag passInput" onChange={(e) => setPassFirst(e.target.value)} onBlur={() => checkPassword(passFirst)} required />
                            {!showPass ? <RiEyeCloseFill onClick={handlePassShow} className="icon" /> : <IoIosEye onClick={handlePassShow} className="icon" />}
                        </div>
                    </label>
                    <p className="messageToShow" style={{ color: !isStrongPass ? "red" : "green" }}>{showPassMessage}</p>

                </div>


                <div className="parent">
                    <label className="labelTag">Confirm password
                        <input type="password" className="inputTag" autoComplete="off" onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <p className="messageToShow" style={{ color: !isSamePass ? "red" : "green" }}>{samePassMessage}</p>

                </div>



                <div id="signupPage">
                    <button className="signupButton" onClick={cancelSignUp}>Cancel</button>
                    <button className="signupButton" onClick={signUp}>Sign up</button>
                </div>
                {/* <button id="signupButton">Create account</button> */}
            </form>
        </div>

        // </dialog>
    )

}

export default Signup;