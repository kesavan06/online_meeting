
import "../Signin.css"

export default function Signin()
{
    function signIn()
    {
        
    }
    return(
        <div> 
            <form id="signin">
                <h1 style={{color:"white"}}>Sign in to your account</h1>
                <p style={{color:"rgb(159 163 166 / 88%)"}}>Don't have an account? Sign up</p>
                <label className="label">Email address
                    <input type="email" name="emailAddress" className="input" required></input>
                </label>
                <label className="label">Password
                    <input type="password" name="emailAddress" className="input" required></input>
                </label>
                <div id="signinButtons">
                    <button id="button">Cancel</button>
                    <button id="button" onClick={signIn}>Sign in</button>
                </div>
                {/* <button>Sign in</button> */}
                {/* <button id="button">Cancel</button> */}
            </form>
        </div>
    )
    // return(
    //     <div style={{width:"100vw",height:"98vh",display:"flex",boxSizing:"border-box"}}>
    //         <div style={{width:"50%",height:"100%",backgroundColor:"white"}}></div>
    //         <div style={{width:"50%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#0A0A0A"}}>
    //             <h1>Sign in</h1>
    //             <form style={{width:"350px",height:"350px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
    //                 <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Email
    //                     <input type="email" name="email" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
    //                 </label>
    //                 <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Password
    //                     <input type="password" name="password" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
    //                 </label>
    //                 <button style={{color:"black",width:"350px",height:"60px",backgroundColor:"white",borderRadius:"40px"}}>Sign in</button>
    //             </form>
    //         </div>
    //     </div>
    // )
}
