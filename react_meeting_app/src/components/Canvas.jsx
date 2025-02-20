import { useRef, useState, useEffect } from "react";

import { RiBrushAiFill } from "react-icons/ri";
import { PiEraserFill } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";


export default function Canvas(props) {

    let canvasRef = props.canvasRef;
    let canvas = "";
    let context = "";

    let isErasing = props.isEraser;
    let color = props.color;

    let isDrawingRef = props.isDrawingRef;

    let brushWidth = props.brushWidth;
    let eraserWidth = props.widthOfEraser;


    let [position, setPosition] = useState({ x:0, y:0 });  

    const getMousePosition = (event) => {

        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height),
        };
    }



    let isDrawingActive = false;



    const startDrawing1 = (event) => {


        if (!isDrawingRef.current) return 

        context.beginPath();
        let { x, y } = getMousePosition(event);

        context.moveTo(x, y);
        isDrawingActive = true;

    };


  
    const draw = (event) => {

        setPosition({ x: event.clientX-25, y: event.clientY-4 });

        if (!isDrawingRef || !isDrawingActive) return;

        let { x, y } = getMousePosition(event);


        if (isErasing.current) {

            context.lineWidth = eraserWidth.current;
            context.clearRect(x, y, eraserWidth.current, eraserWidth.current);
        }
        else {
            context.lineTo(x, y);
            context.strokeStyle = 'white';
            context.strokeStyle = color.current;
            context.lineWidth = brushWidth.current;

        }

        context.stroke();
    };


    const stopDrawing = () => {
        isDrawingActive = false;
        context.beginPath();
    };



    useEffect(() => {
        canvas = canvasRef.current;
        if (canvas) {
            context = canvas?.getContext("2d");

        }
        else {
            console.log("Can't get 2d");
        }



        canvas.addEventListener('mousedown', startDrawing1);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseleave', stopDrawing);


        return () => {

            canvas.removeEventListener('mousedown', startDrawing1);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing)
            canvas.removeEventListener('mouseleave', stopDrawing);
        };

    }, [])



    return (
        <>
            <canvas ref={canvasRef} className={props.class} width={1720} height={1064} style={{position: "relative", cursor:"none"}}> </canvas>

            <div style={{ transition: "transform 0.05s linear", pointerEvents: "none", position: "absolute", left: position.x, top: position.y}} >
              {isDrawingRef.current && !isErasing.current && <FaPencilAlt style={{fontSize: "1.7rem", rotate: "180deg"}}/> }
              {isErasing.current &&  <PiEraserFill style={{fontSize: "1.7rem", rotate: "180deg",   color:"black"}}/>}
              {!isDrawingRef.current && <div style={{width:"20px", height: "21px", borderRadius: "100%",backgroundColor: "black"}}></div>}
            </div>
        </>
    )
}