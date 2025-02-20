import Canvas from "./Canvas"
import { useState, useRef, useEffect } from "react";
import ButtonDiv from "./ButtonIn";


import style from "../Canvas.module.css";
import Parent from "./Parent";

export default function WhiteBoard({ parentShow }) {

    let isDrawingRef = useRef(false);
    let canvasRef = useRef(null);
    let eraserRef = useRef(false);
    const colorRef = useRef("#000000")
    let brushRef = useRef(5);
    let eraserWidthRef = useRef(10);
    const [display, setDisplay] = useState(false);


    const [, forceRender] = useState(false);

    const setIsDrawing = (value) => {
        isDrawingRef.current = value;
        forceRender((prev) => !prev);
    };

    const setEraser = (value) => {
        eraserRef.current = value;
    }

    const setColor = (value) => {
        colorRef.current = value;
    }

    const setBrushWidth = (value) => {
        brushRef.current = value;
    }

    const setEraserWidth = (value) => {
        eraserWidthRef.current = value;
    }



    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            let ctx = canvas.getContext('2d');
            isDrawingRef.current = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    function displayWrap() {
        setDisplay(!display);
    }



    return (
        <>
            <Parent>
                <ButtonDiv setIsDrawing={setIsDrawing} isDrawing={isDrawingRef.current} clearCanvas={clearCanvas} setEraser={setEraser} color={setColor} setBrushWidth={setBrushWidth} setEraserWidth={setEraserWidth}  displayParent={displayWrap} parentShow={parentShow} />
                <Canvas isDrawingRef={isDrawingRef} class={style.canvas} canvasRef={canvasRef} isEraser={eraserRef} color={colorRef} brushWidth={brushRef} widthOfEraser={eraserWidthRef} />
            </Parent>
        </>
    )

}