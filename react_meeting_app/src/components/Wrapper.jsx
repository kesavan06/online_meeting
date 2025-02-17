import "../Signup.css";

export default function Wrapper({children})
{
    return(
        <>
            <div id="backdrop"></div>
            <dialog open id="modal">
                {children}
            </dialog>
        </>
    )
}
