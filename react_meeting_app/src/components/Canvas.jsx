import { useRef, useState, useEffect } from "react";

import { RiBrushAiFill } from "react-icons/ri";
import { PiEraserFill } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import rough from "roughjs/bundled/rough.esm";


const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type) {

    console.log("Create ELEment : ",type);
    let roughElement;
    if (type === "rectangle") {
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
    }
    else if (type == "line") {
        roughElement = generator.line(x1, y1, x2, y2);
    }
    return { id, x1, y1, x2, y2, type, roughElement };
}


const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;

    setElements(elementsCopy);
}

const adjustElementCoordinates = (element) => {
    const { type, x1, x2, y1, y2 } = element;

    if (type == "rectangle") {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
    else {
        if (x1 < x2 || (x1 == x2 && y1 < y2)) {
            return { x1, y1, x2, y2 };
        }
        else {
            return { x1: x2, y1: y2, x2: x1, y2: y1 };

        }
    }
}













export default function Canvas(props) {

    let canvasRef = props.canvasRef;
    let canvas = "";
    let context = "";

    let isErasing = props.isEraser;
    let color = props.color;

    let isDrawingRef = props.isDrawingRef;

    let brushWidth = props.brushWidth;
    let eraserWidth = props.widthOfEraser;

    let tool = props.tool;
    let action = props.action;
    let setAction = props.setAction;
    let selectedElement = props.selectedElement;
    let setSelectedElement = props.setSelectedElement;
    let elements = props.elements;
    let setElements = props.setElements;




    let [position, setPosition] = useState({ x: 0, y: 0 });

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

        //
        const { clientX, clientY } = event;

        if (tool == "selection") {

            const element = getElementAtPosition(clientX, clientY, elements);
            // if we are on an element
            console.log("An element is there: ", element);

            if (element) {
                const offsetX = clientX - element.x1;
                const offsetY = clientY - element.y1
                setSelectedElement({ ...element, offsetX, offsetY });
                setAction("moving");

            }
        }
        else {

            const index = elements.length;

            const element = createElement(index, clientX, clientY, clientX, clientY, tool);
            setElements(prevState => [...prevState, element]);


            setAction("drawing");
        }


    };



    const draw = (event) => {

        setPosition({ x: event.clientX - 25, y: event.clientY - 4 });

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

        const { clientX, clientY } = event;

        if (tool == "selection") {
            const element = getElementAtPosition(clientX, clientY, elements);

            event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
        }

        if (action == "drawing") {
            const index = elements.length - 1;
            const { x1, y1 } = elements[index];

            updateElement(index, x1, y1, clientX, clientY, tool);

        }
        else if (action == "moving") {

            const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
            const width = x2 - x1;
            const height = y2 - y1;

            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;

            updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);

        }

        context.stroke();
    };


    const stopDrawing = () => {

        if (action == "drawing") {

            const index = elements.length - 1;
            const { id, type } = elements[index];


            const { x1, x2, y1, y2 } = adjustElementCoordinates(elements[index]);
            updateElement(id, x1, y1, x2, y2, type);
        }
        setAction("none");
        setSelectedElement(null);


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
            <canvas ref={canvasRef} className={props.class} width={610} height={560} style={{ position: "relative", cursor: "none" }}> </canvas>

            <div style={{ transition: "transform 0.05s linear", pointerEvents: "none", position: "absolute", left: position.x, top: position.y }} >
                {isDrawingRef.current && !isErasing.current && <FaPencilAlt style={{ fontSize: "1.7rem", rotate: "180deg" }} />}
                {isErasing.current && <PiEraserFill style={{ fontSize: "1.7rem", rotate: "180deg", color: "black" }} />}
                {!isDrawingRef.current && <div style={{ width: "20px", height: "21px", borderRadius: "100%", backgroundColor: "black" }}></div>}
            </div>
        </>
    )
}