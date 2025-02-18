import { useState,useEffect } from "react";
import Button from "./Button";
import style from "../Canvas.module.css";
import { FaPaintBrush } from "react-icons/fa";
import { TbBrushOff } from "react-icons/tb";
import { FaEraser } from "react-icons/fa6";
import { PiBroomFill } from "react-icons/pi";
import { MdCancel } from "react-icons/md";


export default function ButtonDiv(props) {

    let [width, setWidth] = useState(false);
    let [showEraserBar, setShowEraserBar] = useState(false);


    let setDrawing = props.setIsDrawing;
    let clearCanvas = props.clearCanvas;
    let setEraser = props.setEraser;
    let setColor = props.color;

    let [color, setColorNow] = useState("#FFFFFF");
    


    let setBrushWidth = props.setBrushWidth;
    let setEraserWidth = props.setEraserWidth;

    let [widthOfBrush, setWidthOfBrush] = useState(5);
    let [widthOfEraser, setWidthOfEraser] = useState(10);




    function startDrawing(e) {
        setDrawing(true);
        setEraser(false);
        setWidth(!width);
    }

    function stopDrawing() {
        setDrawing(false);
    }

    function clearAll() {
        clearCanvas();
    }

    function setEraserOn() {
        setDrawing(true);
        setEraser(true);
        setShowEraserBar(!showEraserBar);
    }


    function setColorForBrush(e) {

        setColor(e.target.value);
        setColorNow(e.target.value);
    }


    function handleWidthChange(e) {
        setWidthOfBrush(e.target.value);
        setBrushWidth(e.target.value);
    }


    function handleWidthForEraser(e) {

        setWidthOfEraser(e.target.value);
        setEraserWidth(e.target.value);

    }

    function handleClickInEraser() {
        setShowEraserBar(false);
    }

    function handleClick() {
        setWidth(false);
    }

    useEffect(()=>{
        setColor("white");
    },[])


    return (
        <div className={style.parent}>

            <Button value={<FaPaintBrush style={{ fontSize: "2rem" }} />} onClick={startDrawing} type="button"></Button>
            <p style={{ color: "white" }}>Width : {widthOfBrush}</p>
            {(width) && <input type="range" min={5} max={100} value={widthOfBrush} onChange={handleWidthChange} onClick={handleClick}></input>}

            <Button value={<TbBrushOff style={{ fontSize: "2rem" }} />} onClick={stopDrawing} type="button"></Button>

            <Button value={<FaEraser style={{ fontSize: "2rem" }} />} onClick={setEraserOn} type="button"></Button>
            <p style={{ color: "white", fontSize : "15px" }} width={"70%"}>Width : {widthOfEraser}</p>

            {(showEraserBar) && <input type="range" min={5} max={100} value={widthOfEraser} onChange={handleWidthForEraser} onClick={handleClickInEraser}></input>}


            <input value={color} onChange={setColorForBrush} className={style.input} type="color" />


            <Button value={<PiBroomFill style={{ fontSize: "2rem" }} />} onClick={clearAll} type="button"></Button>

            <Button value={<MdCancel style={{ fontSize: "2rem" }} />} onClick={props.parentShow} type="button"></Button>

        </div>
    )
}