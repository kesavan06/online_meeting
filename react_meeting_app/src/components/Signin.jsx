

export default function Signin()
{
    // return(
    //     <> 
    //         <form style={{width:"450px",height:"240px",paddingTop:"50px",paddingBottom:"50px",backgroundColor:"#1F2937",display:"flex",flexDirection:"column",paddingLeft:"40px",alignItems:"flex-start",justifyContent:"space-between"}}>
    //             <label style={{color:"white",display:"flex",flexDirection:"column",textAlign:"left"}}>Email address
    //                 <input type="email" name="emailAddress" style={{width:"400px",fontSize:"18px",height:"40px",backgroundColor:"#374151",border:"none",borderRadius:"8px"}}></input>
    //             </label>
    //             <label style={{color:"white",display:"flex",flexDirection:"column",textAlign:"left"}}>Password
    //                 <input type="password" name="emailAddress" style={{width:"400px",fontSize:"18px",height:"40px",backgroundColor:"#374151",border:"none",borderRadius:"8px"}}></input>
    //             </label>
    //             <button style={{color:"white",width:"400px",height:"40px",backgroundColor:"#7C3AED"}}>Sign in</button>
    //         </form>
    //     </>
    // )
    return(
        <div style={{width:"100vw",height:"98vh",display:"flex",boxSizing:"border-box"}}>
            <div style={{width:"50%",height:"100%",backgroundColor:"white"}}></div>
            <div style={{width:"50%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#0A0A0A"}}>
                <h1>Sign in</h1>
                <form style={{width:"350px",height:"350px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Email
                        <input type="email" name="email" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
                    </label>
                    <label style={{color:" #464646",display:"flex",flexDirection:"column",textAlign:"left"}}>Password
                        <input type="password" name="password" style={{width:"350px",height:"50px",border:"1px solid #464646",borderRadius:"22px",backgroundColor:"#0A0A0A"}}></input>
                    </label>
                    <button style={{color:"black",width:"350px",height:"60px",backgroundColor:"white",borderRadius:"40px"}}>Sign in</button>
                </form>
            </div>
        </div>
    )
}
