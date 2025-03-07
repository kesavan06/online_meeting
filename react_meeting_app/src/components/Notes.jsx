import { useRef, useState } from "react";
import "../Notes.css";
import { FaXmark } from "react-icons/fa6";

export default function Notes({ setShowNotes }) {
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnorder, setIsUnorder] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const divRef = useRef(null);

  function setBold() {
    if (!divRef.current) {
      console.log("Not correct");
      return;
    }
    if (!divRef.current.innerHTML || divRef.current.innerHTML.trim() === "") {
      divRef.current.innerHTML = " ";
    }
    setIsBold(!isBold);
    divRef.current.focus();
    // document.getSelection().focusNode.parentElement.style.fontWeight = "bold";
    document.execCommand("bold", false, null);
    divRef.current.focus();
  }

  function setUnderLine() {
    if (!divRef.current) {
      return;
    }
    if (!divRef.current.innerHTML || divRef.current.innerHTML.trim() === "") {
      divRef.current.innerHTML = " ";
    }
    setIsUnderline(!isUnderline);
    divRef.current.focus();
    document.execCommand("underline", false, null);
    divRef.current.focus();
  }

  function setItalic() {
    if (!divRef.current) {
      return;
    }
    if (!divRef.current.innerHTML || divRef.current.innerHTML.trim() === "") {
      divRef.current.innerHTML = " ";
    }
    setIsItalic(!isItalic);
    divRef.current.focus();
    document.execCommand("italic", false, null);
    divRef.current.focus();
  }

  function setUnorder() {
    if (!divRef.current) {
      return;
    }
    if (!divRef.current.innerHTML || divRef.current.innerHTML.trim() === "") {
      divRef.current.innerHTML = " ";
    }
    setIsUnorder(!isUnorder);
    divRef.current.focus();
    document.execCommand("insertUnorderedList", false, null);
    divRef.current.focus();
  }

  function setOrder() {
    if (!divRef.current) {
      return;
    }
    if (!divRef.current.innerHTML || divRef.current.innerHTML.trim() === "") {
      divRef.current.innerHTML = " ";
    }
    setIsOrder(!isOrder);
    divRef.current.focus();
    document.execCommand("insertOrderedList", false, null);
    divRef.current.focus();
  }

  function setClose() {
    setShowNotes(false);
  }

  return (
    <div id="wholeContainer">
      <input placeholder="Title" type="text"></input>
      <div ref={divRef} contentEditable={true} id="notesDiv"></div>
      <div
        style={{
          width: "100%",
          height: "60px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          className="notesControl"
          style={{ width: "50px", height: "50px" }}
          onClick={setBold}
        >
          <b>B</b>
        </button>
        <button
          className="notesControl"
          style={{ width: "50px", height: "50px" }}
          onClick={setUnderLine}
        >
          <u>U</u>
        </button>
        <button
          className="notesControl"
          style={{ width: "50px", height: "50px" }}
          onClick={setItalic}
        >
          <i>I</i>
        </button>
        <button
          className="notesControl"
          style={{ width: "90px", height: "50px" }}
          onClick={setUnorder}
        >
          Unorder
        </button>
        <button
          className="notesControl"
          style={{ width: "90px", height: "50px" }}
          onClick={setOrder}
        >
          Order
        </button>
        <div
          className="close"
          onClick={() => {
            setShowNotes((prev) => false);
          }}
          style={{ width: "60px", height: "50px" }}
        >
          <FaXmark style={{width:"25px", height:"25px"}} className="close"></FaXmark>
        </div>
      </div>
    </div>
  );
}
