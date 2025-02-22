
import "../Signin.css"
import Login from "./SignIn";


export default function Signin(props)
{

    let {nameUnique, setNameUnique} = props;
    let {password, setPassword} = props;

    function cancelShowSignIn()
    {
        props.setShowSignIn(false);
    }

    function showSignUp()
    {
        props.setShowSignUp(true);
        props.setShowSignIn(false);
    }

    function signIn(event)
    {
        event.preventDefault();
        if(nameUnique != "" && password != ""){
            handleUniqueName();
        }
    }


    function handleUniqueName(){
        console.log(nameUnique, password);
        let userLogin = Login(nameUnique, password);
        console.log(userLogin);
    }










    return(
        <div> 
            <form id="signin">
                <h1 style={{color:"white"}}>Sign in to your account</h1>

                <p style={{color:"rgb(159 163 166 / 88%)"}}>Don't have an account? <span style={{color:"#7C3AED",cursor:"pointer"}} onClick={showSignUp}>Sign up</span></p>

                <label className="label">User name
                    <input type="text" name="unique_name" className="input" onChange={(e)=> setNameUnique(e.target.value)} required></input>
                </label>

                <label className="label">Password
                    <input type="password" name="password" className="input"  onChange={(e)=> setPassword(e.target.value)} required></input>
                </label>

                <p></p>

                <div id="signinButtons">
                    <button class="button" onClick={cancelShowSignIn}>Cancel</button>
                    <button class="button" onClick={signIn}>Sign in</button>
                </div>

            </form>
        </div>
    )
}
