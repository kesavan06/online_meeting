
import React from "react";
import "../Feature.css"

function Feature(probs) {
   {
        return (
            <div id="container" onClick={probs.white}>
                <img src={probs.src} className="image" />
                <h2 id="heading">{probs.title}</h2>
                <p id="content">{probs.content}</p>
            </div>
        )
    }
}

export default Feature;
