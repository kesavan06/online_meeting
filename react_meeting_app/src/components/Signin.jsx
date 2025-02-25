import { useAppContext } from "../Context";
import "../Signin.css"
import Login from "./SignIn";


export default function Signin(props) {

  let { nameUnique, setNameUnique } = props;
  let { password, setPassword } = props;
  let { user, key, user_id } = useAppContext();


  function cancelShowSignIn(event) {
    event.preventDefault();
    props.setShowSignIn(false);
  }

  function showSignUp() {
    props.setShowSignUp(true);
    props.setShowSignIn(false);
  }

  async function signIn(event) {
    event.preventDefault();

    if (nameUnique != "" && password != "") {
      console.log(nameUnique, password);
      let userLogin = await Login(nameUnique, password);

      if (userLogin != null) {
        // console.log("User Login Now : ",userLogin);
        user.current = userLogin.user_name;
        key.current = userLogin.user_key;
        console.log("User ID: ", user_id);
        user_id.current = userLogin.user_id;

        console.log("User in sign in : -----", user, key, user_id);

        props.setShowSignIn(false);
      }
      else{
        console.log("User not correct");
      }

    }
  }











  return (
    <div>
      <form id="signin">
        <h1 style={{ color: "white" }}>Sign in to your account</h1>

        <p style={{ color: "rgb(159 163 166 / 88%)" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#3b82f6", cursor: "pointer" }}
            onClick={showSignUp}
          >
            Sign up
          </span>
        </p>

        <label className="label">
          User name
          <input
            type="text"
            name="unique_name"
            className="input"
            onChange={(e) => setNameUnique(e.target.value)}
            required
          ></input>
        </label>

        <label className="label">
          Password
          <input
            type="password"
            name="password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </label>

        <p></p>

        <div className="signinButtons">
          <button className="cancelBtn" onClick={(e) => cancelShowSignIn(e)}>
            Cancel
          </button>
          <button className="signinBtn" onClick={(e) => signIn(e)}>
            Signin
          </button>
        </div>
      </form>
    </div>
  );
}
