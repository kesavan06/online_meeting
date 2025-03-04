import { useRef, useState, useEffect, useLayoutEffect } from "react";

import { RiBrushAiFill } from "react-icons/ri";
import { PiEraserFill } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import rough from "roughjs/bundled/rough.esm";


const generator = rough.generator();


function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}


function createArrowHeads(x, y, angle, size) {
    return [
        {
            x: x - size * Math.cos(angle - Math.PI / 6), y: y - size * Math.sin(angle - Math.PI / 6),
        },
        {
            x: x - size * Math.cos(angle + Math.PI / 6), y: y - size * Math.sin(angle + Math.PI / 6),
        }
    ]
}


function drawArrowHeades(x, y, angle) {
    const [p1, p2] = createArrowHeads(x, y, angle, 10);
    return [
        generator.line(x, y, p1.x, p1.y),
        generator.line(x, y, p2.x, p2.y),
    ]
}


function createElement(x1, y1, x2, y2, type) {

    // console.log("Create ELEment : ", type);
    let roughElement;

    switch (type) {
        case "rectangle":
            roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
            break;
        case "line":
            roughElement = generator.line(x1, y1, x2, y2);
            break;
        case "circle":
            const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            roughElement = generator.circle(x1, y1, radius * 2);
            break;

        case "diamond":
            const x = (x1 + x2) / 2;
            const y = (y1 + y2) / 2;
            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);

            roughElement = generator.polygon([
                [x, y - height / 2],     // Top
                // [x + width , y - height / 2], // Extra upper-right point
                [x + width / 2, y],      // Right
                [x, y + height / 2],     // Bottom
                [x - width / 2, y]       // Left
            ]);

            break;

        case "triangle":
            const xT = (x1 + x2) / 2;
            const yT = (y1 + y2) / 2;
            const sizeTriangle = Math.abs(x2 - x1);

            roughElement = generator.polygon([
                [xT - sizeTriangle / 2, yT + sizeTriangle / 2],
                [xT + sizeTriangle / 2, yT + sizeTriangle / 2],
                [xT, yT - sizeTriangle / 2]
            ]); //, {fill: "green", fillWeight :5}
            break;

        case "arrow":
            const angle = calculateAngle(x1, y1, x2, y2);
            const mainLine = generator.line(x1, y1, x2, y2);
            const arrows = drawArrowHeades(x2, y2, angle);

            roughElement = [mainLine, ...arrows]
            break;

        default:
            console.error("❌ Unsupported shape type:", type);
            return null;
    }


    if (!roughElement) {
        console.error("❌ roughElement creation failed", { x1, y1, x2, y2, type });
        return null;
    }
    return { x1, y1, x2, y2, type, roughElement };
}


// const updateElement = (id, x1, y1, x2, y2, type) => {
//     const updatedElement = createElement(id, x1, y1, x2, y2, type);

//     const elementsCopy = [...elements];
//     elementsCopy[id] = updatedElement;

//     setElements(elementsCopy);
// }

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
    let drawShapes = props.drawShapes;

    let [showCursor, setShowCursor] = useState(true);
    const elementsRef = props.elementsRef;


    let [position, setPosition] = useState({ x: 0, y: 0 });

    const getMousePosition = (event) => {

        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height),
        };
    }



    let isDrawingActive = false;



    // mouse down

    const startDrawing1 = (event) => {

        if (!isDrawingRef.current) return

        isDrawingActive = true;

        let { x, y } = getMousePosition(event);

        if (drawShapes.current == true) {

            const element = createElement(x, y, x, y, tool.current);
            elementsRef.current = [...elementsRef.current, element];
            setElements(elementsRef.current);

        }

    };



    // mouse move

    const draw = (event) => {

        setPosition({ x: event.clientX - 25, y: event.clientY - 4 });

        if (!isDrawingRef || !isDrawingActive) return;

        let { x, y } = getMousePosition(event);

        if (isErasing.current) {

            context.lineWidth = eraserWidth.current;
            context.clearRect(x, y, eraserWidth.current, eraserWidth.current);
        }
        else if (drawShapes.current == true && isDrawingRef.current) {
            // console.log("X, y : ", x, y);

            const index = elementsRef.current.length - 1;


            if (elementsRef.current.length === 0) return;

            const { x1, y1 } = elementsRef.current[index];

            const updatedElement = createElement(x1, y1, x, y, tool.current);

            elementsRef.current[index] = updatedElement;
            setElements([...elementsRef.current]);


        }
        else {
            context.lineTo(x, y);
            console.log("draw : ", x, y);
            context.strokeStyle = 'white';
            context.strokeStyle = color.current;
            context.lineWidth = brushWidth.current;

        }


        context.stroke();
    };



    // mouse up && mouse leave

    const stopDrawing = () => {


        setAction("none");
        setSelectedElement(null);

        isDrawingActive = false;
        context.beginPath();
    };

    function handleMouseLeave() {
        setShowCursor(false);
        canvasRef.current.style.cursor = "auto";
    }


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

    useEffect(() => {
        console.log("Element : ", elements);

        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d"); // Get the 2D context
            if (!context) return;

            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            const roughCanvas = rough.canvas(canvasRef.current);
            elements.forEach(({ roughElement }, i) => {
                if (!roughElement) {
                    console.error(`❌ Element at index ${i} is invalid:`, el);
                    return;
                }

                if (Array.isArray(roughElement)) {
                    roughElement.forEach(el => roughCanvas.draw(el));
                } else {
                    roughCanvas.draw(roughElement);
                }

            });

        }
    }, [elements])

    function handleEnter() {
        canvasRef.current.style.cursor = "default";
    }


    return (
        <>
            <canvas ref={canvasRef} className={props.class} width={1010} height={1060} style={{ position: "relative", cursor: "none", border: "1px solid white", borderLeft: "0px solid" }} id="canvas_new"> </canvas>

            {showCursor &&
                <div style={{ transition: "transform 0.05s linear", pointerEvents: "none", position: "absolute", left: position.x, top: position.y }} onMouseLeave={() => handleMouseLeave()} onMouseEnter={handleEnter}>
                    {isDrawingRef.current && !isErasing.current && <FaPencilAlt style={{ fontSize: "1.7rem", rotate: "180deg" }} />}
                    {isErasing.current && <PiEraserFill style={{ fontSize: "1.7rem", rotate: "180deg", color: "black" }} />}
                    {!isDrawingRef.current && <div style={{ width: "20px", height: "21px", borderRadius: "100%", backgroundColor: "black" }}></div>}
                </div>
            }
        </>
    )
}