import { useRef,useState, useEffect } from "react";


export default function Canvas(props) {

    let canvasRef = props.canvasRef;
    let canvas = "";
    let context = "";

    let isErasing = props.isEraser;
    let color = props.color;

    let isDrawingRef = props.isDrawingRef;

    let brushWidth = props.brushWidth;
    let eraserWidth = props.widthOfEraser;



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
            // console.log("Can't get 2d");
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
        <canvas ref={canvasRef} className={props.class} width={1720} height={1064}> </canvas>
    )
}