import { useRef, useState } from "react";
import "../Signup.css";

function Signup() {
    // const dialogRef=useRef(null);
    // if(probs.showSignUp)
    // {
    //     dialogRef.current.open();
    // }
    // if(!probs.showSignUp)
    // {
    //     dialogRef.current.close();
    // }

    const [user,setUser] = useState()

    function signUp()
    {

    }

    return (
        // <dialog ref={dialogRef} style={{backgroundColor:"white"}}>
        <div>

            <form id="signUp">
                <label className="labelTag">User name
                    <input type="text" name="fullName" className="inputTag" required></input>
                </label>
                <label className="labelTag">Name
                    <input type="text" name="emailAddress" className="inputTag" required></input>   
                </label>
                <label className="labelTag">Password
                    <input type="password" className="inputTag" required></input>
                </label>
                <label className="labelTag">Confirm password
                    <input type="password" className="inputTag" required></input>
                </label>
                <div id="signupPage">
                    <button className="signupButton">Cancel</button>
                    <button className="signupButton"onClick={signUp}>Sign up</button>
                </div>
                {/* <button id="signupButton">Create account</button> */}
            </form>
        </div>

        // </dialog>
    )
    // return(
    //     <div style={{width:"100vw",height:"98vh",display:"flex",boxSizing:"border-box"}}>
    //         <div style={{width:"50%",height:"100%",backgroundColor:"white"}}></div>
    //         <div style={{width:"50%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#0A0A0A"}}>
    //             <h1>Sign Up</h1>
    //             <form style={{width:"450px",height:"450px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
    //                 <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Full name
    //                     <input type="text" name="fullName" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
    //                 </label>
    //                 <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Email
    //                     <input type="email" name="email" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
    //                 </label>
    //                 <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Password
    //                     <input type="password" name="password" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
    //                 </label>
    //                 <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Confirm password
    //                     <input type="password" name="password" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
    //                 </label>
    //                 <button style={{color:"black",width:"350px",height:"60px",backgroundColor:"white",borderRadius:"40px"}}>Sign Up</button>
    //             </form>
    //         </div>
    //     </div>
    // )
}

export default Signup;