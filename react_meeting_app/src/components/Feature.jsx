
import React from "react";
import "../style/Feature.css"

function Feature(probs)
{
    return(
        <div id="container">
            <img src={probs.src}/>
            <h3 id="heading">{probs.title}</h3>
            <p id="content">{probs.content}</p>
        </div>
    )
}

export default Feature;
