import "../poll.css"

export default function Poll({title,option1,option2})
{
    return(
        <div id="pollDiv">
            <h1>{title}</h1>
            <label className="option">
                <input type="radio" name="poll"></input>
            {option1}</label>
            <label className="option">
                <input type="radio" name="poll"></input>    
            {option2}</label>
        </div>
    )
}

