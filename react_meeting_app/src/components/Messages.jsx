import "../ChatBox.css";

export default function Message({ user_name, message, time, classNow }) {

    try {
        console.log("In message: ", user_name, message);
    } 
    catch (error) {
        console.error("Error in Message component:", error);
    }

    return (
        <div className={classNow ? "chatThread right": "chatThread" }>

            <div className="userDetail">
                <p id="name">{user_name}</p>
                <p id="time">{time}</p>
            </div>

            <div className="message">
                <p className="messagePara">
                    {message}
                </p>
            </div>

        </div>
    )
}
