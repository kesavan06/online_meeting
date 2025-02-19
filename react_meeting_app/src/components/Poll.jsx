

export default function Poll({title,option1,option2})
{
    return(
        <div>
            <h1>{title}</h1>
            <input type="radio" name="poll"></input>
            <label>{option1}</label>
            <input type="radio" name="poll"></input>
            <label>{option2}</label>
        </div>
    )
}