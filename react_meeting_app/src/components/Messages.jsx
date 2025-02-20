import "../ChatBox.css";

export default function Message({ user_name, message }) {

    try {
        console.log("In message: ", user_name, message);
    } 
    catch (error) {
        console.error("Error in Message component:", error);
    }

    return (
        <div className="chatThread">

            <div className="userDetail">
                <p id="name">{user_name}</p>
                <p id="time">11:11 am</p>
            </div>

            <div className="message">
                <p className="messagePara">
                    {message}
                </p>
            </div>

        </div>
    )
}