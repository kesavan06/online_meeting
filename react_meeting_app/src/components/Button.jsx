import style from "../Canvas.module.css";


export default function Button({value, onClick, type}){
    return (
        <button onClick={onClick} type={type} className={style.button} style={{width: "6%", height: "53%", borderRadius: "5px", background: "#111827", cursor: "pointer", color: "white", transition : "all 0.3s ease-in", border : "1px solid transparent"}}>{value}</button>
    )
}