import style from  "../Canvas.module.css";

export default function Parent({children}){
    return(
        <div className={style.wrapper}>
            {children}
        </div>
    )
}