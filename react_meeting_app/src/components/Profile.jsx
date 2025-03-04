import style from "../Profile.module.css"

function Profile({firstLetter}){
    return(
        <>
            <div className={style.profile}>
                {firstLetter}
            </div>
        </>
    )
}


export default Profile;