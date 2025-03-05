import { useRef, useState, useEffect, useLayoutEffect } from "react";

import { RiBrushAiFill } from "react-icons/ri";
import { PiEraserFill } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import rough from "roughjs/bundled/rough.esm";


const generator = rough.generator();
let count = 0;
let indexN = 0;

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


function createElement(id, x1, y1, x2, y2, type, text) {

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
                [x, y - height / 2],
                [x + width / 2, y],
                [x, y + height / 2],
                [x - width / 2, y]
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

        case "text":
            roughElement = { text, x1, y1 };
            break;

        default:
            console.error("❌ Unsupported shape type:", type);
            return null;
    }


    if (!roughElement) {
        console.error("❌ roughElement creation failed", { x1, y1, x2, y2, type });
        return null;
    }
    return { id, x1, y1, x2, y2, type, roughElement, text };
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

    let [isTyping, setIsTyping] = useState(false);
    let [coordinate, setCoordinate] = useState({ x1: 0, y1: 0 });

    let textAreaRef = useRef();

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

        // if (isTyping) {
        //     console.log("Typing in progress, preventing new element creation.");
        //     event.stopPropagation();
        //     return;
        // }
        // else {
        //     console.log("GOing to create a new one : is typeig", isTyping);
        // }
        
        if (drawShapes.current == true || tool.current == "text") {

            if (tool.current == "text") {

                if (isTyping) return;

                const element = createElement(indexN, x, y, 0, 0, tool.current, "");
                setElements(prevElements => [...prevElements, element]);
                setCoordinate({ x1: x, y1: y });

                // elementsRef.current = [...elementsRef.current, element];
                // setElements(elementsRef.current);

                setSelectedElement(element);

                console.log("Setting element");
                setIsTyping(true);
                // console.log("isTyping after setting:", isTyping);

                setAction("writing");
                // console.log("Mouse Down - Action set to writing");

            }
            else {
                const element = createElement(indexN, x, y, x, y, tool.current);

                elementsRef.current = [...elementsRef.current, element];
                setElements(elementsRef.current);

                setSelectedElement(element);
                // console.log("I come inside");
                setAction("drawing");
            }
            indexN++;
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

            const { x1, y1, type } = elementsRef.current[index];
            // console.log("Type and all : ",x1,y1,type);

            if (type === "text") return;

            const updatedElement = createElement(index, x1, y1, x, y, tool.current);

            elementsRef.current[index] = updatedElement;
            setElements([...elementsRef.current]);


        }
        else {
            if (!isTyping) {
                context.lineTo(x, y);
                console.log("draw : ", x, y);
                context.strokeStyle = 'white';
                context.strokeStyle = color.current;
                context.lineWidth = brushWidth.current;
            }
        }


        context.stroke();
    };



    // mouse up && mouse leave

    const stopDrawing = () => {

        if (action !== "writing") {

            // console.log("Before stopDrawing - Action:", action);
            setAction("none");

        } else {
            // console.log("Blocked setting action to none because it's writing.");
        }

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

            elements.forEach((el, i) => {

                if (!el.roughElement || !el) {
                    console.error(`❌ Element at index ${i} is invalid:`, el);
                    return;
                }

                if (el.type === "text") {
                    context.font = "16px Arial";
                    context.fillStyle = color.current;
                    context.fillText(el.text, el.x1, el.y1);
                }
                else if (Array.isArray(el.roughElement)) {
                    el.roughElement.forEach(el => roughCanvas.draw(el));
                } else {
                    roughCanvas.draw(el.roughElement);
                }

            });

        }
    }, [elements])


    useEffect(() => {

        if (tool == "text") {
            textAreaRef.current.focus();
        }

    }, [action, selectedElement])


    function handleEnter() {
        canvasRef.current.style.cursor = "default";
    }

    useEffect(() => {
        console.log("Tool : ", tool, isTyping);
    }, [tool, action])



    useEffect(() => {
        console.log("Action : ", action);
    }, [action])


    useEffect(() => {
        console.log("Coordinate : ", coordinate, isTyping);
    }, [coordinate])



    function handleBlur() {
        console.log("Before blur:", selectedElement);

        let s = elements[elements.length - 1];
        console.log("S E : ", s);

        let text = textAreaRef.current.value;
        if (text.trim() == "") return;

        setElements(prevElements =>
            prevElements.map(el =>
                el.id === selectedElement.id ? { ...el, roughElement: { ...el.roughElement, text }, text } : el
            )
        );

        console.log("After blur:", selectedElement);

        setTimeout(() => {
            setIsTyping(false);
            setAction("none");
            setSelectedElement(null);
            textAreaRef.current.value = "";
        }, 100)

    }



    return (
        <>
            <canvas ref={canvasRef} className={props.class} width={1010} height={1060} style={{ position: "relative", cursor: "none", border: "1px solid white", borderLeft: "0px solid" }} id="canvas_new" tabIndex="0"> </canvas>

            {showCursor &&
                <div style={{ transition: "transform 0.05s linear", pointerEvents: "none", position: "absolute", left: position.x, top: position.y }} onMouseLeave={() => handleMouseLeave()} onMouseEnter={handleEnter} >
                    {isDrawingRef.current && !isErasing.current && <FaPencilAlt style={{ fontSize: "1.7rem", rotate: "180deg" }} />}
                    {isErasing.current && <PiEraserFill style={{ fontSize: "1.7rem", rotate: "180deg", color: "black" }} />}
                    {!isDrawingRef.current && <div style={{ width: "20px", height: "21px", borderRadius: "100%", backgroundColor: "black" }}></div>}
                </div>
            }

            {
                isTyping &&
                (< textarea
                    ref={textAreaRef}
                    style={{ position: "fixed", top: coordinate.y1, left: coordinate.x1 }}
                    onBlur={handleBlur}
                >
                </textarea>)
            }
        </>
    )
}