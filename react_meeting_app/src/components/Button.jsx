import style from "../Canvas.module.css";


export default function Button({value, onClick, type}){
    return (
        <button onClick={onClick} type={type} className={style.button}>{value}</button>
    )
}