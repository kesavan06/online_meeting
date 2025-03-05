import { useRef, useState } from "react";
import "../Notes.css";

export default function Notes({setShowNotes})
{
    const [isBold,setIsBold] = useState(false);
    const [isUnderline,setIsUnderline] = useState(false);
    const [isItalic,setIsItalic] = useState(false);
    const [isUnorder,setIsUnorder] = useState(false);
    const [isOrder,setIsOrder] = useState(false);
    const divRef = useRef(null);

    function setBold()
    {
        if(!divRef.current)
        {
            console.log("Not correct")
            return;
        }
        if(!divRef.current.innerHTML || divRef.current.innerHTML.trim()==="")
        {
            divRef.current.innerHTML = " ";
        }
        setIsBold(!isBold);
        divRef.current.focus();
        // document.getSelection().focusNode.parentElement.style.fontWeight = "bold";
        document.execCommand("bold",false,null);
        divRef.current.focus();
    }

    function setUnderLine()
    {
        if(!divRef.current)
        {
            return;
        }
        if(!divRef.current.innerHTML || divRef.current.innerHTML.trim()==="")
        {
            divRef.current.innerHTML = " ";
        }
        setIsUnderline(!isUnderline);
        divRef.current.focus();
        document.execCommand("underline",false,null);
        divRef.current.focus();
    }

    function setItalic()
    {
        if(!divRef.current)
        {
            return;
        }
        if(!divRef.current.innerHTML || divRef.current.innerHTML.trim()==="")
        {
            divRef.current.innerHTML = " ";
        }
        setIsItalic(!isItalic);
        divRef.current.focus();
        document.execCommand("italic",false,null);
        divRef.current.focus();
    }

    function setUnorder()
    {
        if(!divRef.current)
        {
            return;
        }
        if(!divRef.current.innerHTML || divRef.current.innerHTML.trim()==="")
        {
            divRef.current.innerHTML = " ";
        }
        setIsUnorder(!isUnorder);
        divRef.current.focus();
        document.execCommand("insertUnorderedList",false,null);
        divRef.current.focus();
    }

    function setOrder()
    {
        if(!divRef.current)
        {
            return;
        }
        if(!divRef.current.innerHTML || divRef.current.innerHTML.trim()==="")
        {
            divRef.current.innerHTML=" ";
        }
        setIsOrder(!isOrder);
        divRef.current.focus();
        document.execCommand("insertOrderedList",false,null);
        divRef.current.focus();
    }

    function setClose()
    {
        setShowNotes(false);
    }

    return(
        <div id="wholeContainer">
            <div ref={divRef} contentEditable={true}  id="notesDiv"></div>
            <div style={{width:"100%",height:"60px",display:"flex",justifyContent:"space-between"}}>
                <button className={isBold ? "buttonClick" : "normal"} style={{width:"50px",height:"50px"}} onClick={setBold}>B</button>
                <button className={isUnderline ? "buttonClick" : "normal"} style={{width:"50px",height:"50px"}} onClick={setUnderLine}>U</button>
                <button className={isItalic ? "buttonClick" : "normal"} style={{width:"50px",height:"50px"}} onClick={setItalic}>I</button>
                <button className={isUnorder ? "buttonClick" : "normal"} style={{width:"90px",height:"50px"}} onClick={setUnorder}>Unorder</button>
                <button className={isOrder ? "buttonClick" : "normal"} style={{width:"90px",height:"50px"}} onClick={setOrder}>Order</button>
                <button style={{width:"90px",height:"50px"}} onClick={setClose}>Close</button>
            </div>
        </div>
    )
}