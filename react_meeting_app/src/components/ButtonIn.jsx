import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import style from "../Canvas.module.css";
import { FaPaintBrush } from "react-icons/fa";
import { TbBrushOff } from "react-icons/tb";
import { FaEraser, FaSlack } from "react-icons/fa6";
import { PiBroomFill } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";

export default function ButtonDiv(props) {
  let [width, setWidth] = useState(false);
  let [showEraserBar, setShowEraserBar] = useState(false);

  let setDrawing = props.setIsDrawing;
  let clearCanvas = props.clearCanvas;
  let setEraser = props.setEraser;
  let setColor = props.color;

  let setTool = props.setTool;

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

  return (
    <div className={style.parent} style={{width: "100%", height: "10%", display : "flex",  alignItems: "center", gap: "2%", position : "relative",background:  "#1f2937",}}>
      <Button
        value={<FaPaintBrush style={{ fontSize: "1.6rem" }} />}
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
          style={{position: "absolute", bottom: "-1.5%", width: "6%"}}
        ></input>
      )}

      <Button
        value={<TbBrushOff style={{ fontSize: "1.6rem" }} />}
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
          style={{position: "absolute", bottom: "0.5%", width: "6%", left: "24%", marginTop: "1%"}}
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
        value={<PiBroomFill style={{ fontSize: "1.6rem" }} />}
        onClick={clearAll}
        type="button"
        title="Clear"
      ></Button>

    </div>
  );
}
