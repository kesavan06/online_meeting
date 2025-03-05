import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import style from "../Canvas.module.css";
import { FaCircle, FaPaintBrush } from "react-icons/fa";
import { TbBrushOff } from "react-icons/tb";
import { FaEraser, FaSlack } from "react-icons/fa6";
import { PiBroomFill } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";
import { FaShapes } from "react-icons/fa6";
import { MdOutlineRectangle } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { GoDiamond } from "react-icons/go";
import { RiVipDiamondLine } from "react-icons/ri";
import { IoTriangleOutline } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";
import { MdSaveAlt } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaFont } from "react-icons/fa";


export default function ButtonDiv(props) {
  let [width, setWidth] = useState(false);
  let [showEraserBar, setShowEraserBar] = useState(false);

  let setDrawing = props.setIsDrawing;
  let clearCanvas = props.clearCanvas;
  let setEraser = props.setEraser;
  let setColor = props.color;
  let drawShapes = props.drawShapes;
  let takeWhiteBoardScreenShot = props.takeWhiteBoardScreenShot;
  let tool = props.tool;
  // let setTool = props.setTool;

  let [color, setColorNow] = useState("#000000");

  let setBrushWidth = props.setBrushWidth;
  let setEraserWidth = props.setEraserWidth;

  let [widthOfBrush, setWidthOfBrush] = useState(5);
  let [widthOfEraser, setWidthOfEraser] = useState(10);

  let [chooseColor, setChooseColor] = useState(false);
  let [showShape, setShowShape] = useState(false);



  function startDrawing() {
    setDrawing(true);
    setEraser(false);
    drawShapes.current = false;
    setWidth(!width);
  }

  function stopDrawing() {
    setDrawing(false);
    drawShapes.current = false;
  }

  function clearAll() {
    clearCanvas();
  }

  function setEraserOn() {
    setDrawing(true);
    setEraser(true);
    drawShapes.current = false;
    setShowEraserBar(!showEraserBar);
  }

  function setColorForBrush(e) {
    setColor(e.target.value);
    setColorNow(e.target.value);
    console.log("Color : ", color);
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

  function setColorsNow() {
    setChooseColor(!chooseColor);
  }

  function selectShapes() {
    setShowShape((prev) => !prev);
  }


  function handleShapes() {
    setShowShape((prev) => !prev);
  }

  useEffect(() => {
    console.log("Tool : ", tool);
  }, [tool]);

  return (
    <div className={style.parent} style={{ width: "100%", height: "10%", display: "flex", alignItems: "center", gap: "2%", position: "relative", background: "#1f2937", }}>
      <Button
        value={<FaPaintBrush style={{ fontSize: "1.4rem" }} />}
        onClick={startDrawing}
        type="button"
        title="Doodle"
      ></Button>
      <p style={{ color: "white" }}>Width : {widthOfBrush}</p>
      {width && (
        <input
          type="range"
          min={5}
          max={100}
          value={widthOfBrush}
          onChange={handleWidthChange}
          onClick={handleClick}
          style={{ position: "absolute", bottom: "-1.5%", width: "6%" }}
        ></input>
      )}

      <Button
        value={<TbBrushOff style={{ fontSize: "1.4rem" }} />}
        onClick={stopDrawing}
        type="button"
        title="Distable Drawing"
      ></Button>


      <Button
        value={<FaEraser style={{ fontSize: "1.6rem" }} />}
        onClick={setEraserOn}
        type="button"
        title="Select Eraser"
      ></Button>
      <p style={{ color: "white", fontSize: "15px" }} width={"70%"}>
        Width : {widthOfEraser}
      </p>

      {showEraserBar && (
        <input
          type="range"
          min={1}
          max={100}
          value={widthOfEraser}
          onChange={handleWidthForEraser}
          onClick={handleClickInEraser}
          style={{ position: "absolute", bottom: "0.5%", width: "6%", left: "24%", marginTop: "1%" }}
        ></input>
      )}


      <button
        style={{
          width: "6%",
          border: "1px solid black",
          cursor: "pointer",
          height: "53%",
          backgroundColor: "#111827",
          borderRadius: "5px",
          color: "white",
          position: "relative",
          fontSize: "1.4rem"
        }}
        onClick={() => handleShapes()}
        title="Shapes"
      ><FaShapes /></button>

      {showShape &&
        <div style={{ width: "25%", height: "62%", overflowX: "scroll", scrollbarWidth: "none", position: "absolute", background: "#111827", top: "92%", zIndex: 1, left: "34%", display: "flex", whiteSpace: "nowrap", paddingLeft: "1%", color: "white", borderRadius: "10px", gap: "2%" }}>

          <div style={{ width: "15%", height: "95%", flexShrink: 0 }} onClick={() => {
            tool.current = "rectangle";
            console.log("Tool rect selected");
            setDrawing(true);
            setEraser(false);
            drawShapes.current = true;

          }}>
            <MdOutlineRectangle style={{ width: "70%", height: "95%" }} />
          </div>

          <div style={{ width: "15%", height: "95%", flexShrink: 0 }} onClick={() => {
            tool.current = "line";
            console.log("Tool line selected");
            setDrawing(true);
            setEraser(false);
            drawShapes.current = true;

          }}>
            <hr style={{ border: "1.4px solid white", width: "65%", transform: "rotate(45deg)", position: "relative", top: "25%", left: "-15%" }} />
          </div>


          <div style={{ width: "15%", height: "95%", flexShrink: 0 }} onClick={() => {
            tool.current = "circle";
            console.log("Tool circle selected");
            setDrawing(true);
            setEraser(false);
            drawShapes.current = true;

          }}>
            <FaRegCircle style={{ width: "70%", height: "95%" }} />
          </div>

          <div style={{ width: "15%", height: "95%", flexShrink: 0 }} onClick={() => {
            tool.current = "arrow";
            console.log("Tool arrow selected");
            setDrawing(true);
            setEraser(false);
            drawShapes.current = true;

          }}>
            <GoArrowUpRight style={{ width: "70%", height: "95%" }} />
          </div>

          <div style={{ width: "15%", height: "95%", flexShrink: 0 }} onClick={() => {
            tool.current = "diamond";
            console.log("Tool diamond selected");
            setDrawing(true);
            setEraser(false);
            drawShapes.current = true;

          }}>
            <GoDiamond style={{ width: "70%", height: "95%" }} />
          </div>

          <div style={{ width: "15%", height: "95%", flexShrink: 0 }} onClick={() => {
            tool.current = "triangle";
            console.log("Tool triangle selected");
            setDrawing(true);
            setEraser(false);
            drawShapes.current = true;

          }}>
            <IoTriangleOutline style={{ width: "70%", height: "95%" }} />
          </div>

        </div>
      }

      <button
        style={{
          width: "6%",
          border: "1px solid black",
          cursor: "pointer",
          height: "53%",
          backgroundColor: "#111827",
          borderRadius: "5px",
        }}
        title="Color Palette"
      >
        <IoMdColorPalette
          style={{ fontSize: "1.6rem", color: "white" }}
          onClick={setColorsNow}
        />
        {chooseColor && (
          <input
            value={color}
            onChange={setColorForBrush}
            className={style.input}
            type="color"
          />
        )}
      </button>

      <Button
        value={<FaFont style={{ fontSize: "1.4rem", color: "white" }} />}
        onClick={() => {
          tool.current = "text"
          setDrawing(true);
          setEraser(false);
        }}
        title="Text"
      ></Button>

      <Button
        value={<MdSaveAlt style={{ fontSize: "1.4rem" }} />}
        onClick={takeWhiteBoardScreenShot}
        type="button"
        title="Take screenshot"
      ></Button>


      <Button
        value={<FaRegTrashCan style={{ fontSize: "1.4rem" }} />}
        onClick={clearAll}
        type="button"
        title="Clear"
      ></Button>

    </div>
  );
}
