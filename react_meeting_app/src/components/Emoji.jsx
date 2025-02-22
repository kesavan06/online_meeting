import style from "../Emoji.module.css";
import { IoThumbsUp } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { useState, useRef, useEffect } from "react";
import { GoPlus } from "react-icons/go";

export default function Emoji({ emojiHandle, handleOpen }) {

    if (!emojiHandle) {
        console.error("emojiHandle is not passed or is undefined");
    }
    if(!handleOpen){
        console.log("Open is error");
    }


    function handleClickOnEmoji(msg) {
        console.log("Console.log in emoji",emojiRef.current);

        console.log("Emoji : ", msg);
        emojiHandle(msg.emoji);
    }

    let emojiRef = useRef(null);

    useEffect(() => {
        if (emojiRef.current) {
            const headers = emojiRef.current.querySelectorAll(".epr-category-nav");
            console.log("Header: ",headers);

            headers.forEach((header) => {
                header.style.padding = "0%";
                header.style.paddingLeft = "2%";
                header.style.paddingRight = "2%";
            });

            // const emojis = emojiRef.current.querySelectorAll(".epr-emoji-category-content");
            // console.log("Emoji : ",emojis);
        }
    }, []);



    return (
        // <>
        //     <div className={style.emoParent}>
        //         <div><GoPlus onClick={handleOpen}/></div>
        //         <EmojiPicker className={style.allEmoji} open={open} theme="dark" onEmojiClick={(e)=>handleClickOnEmoji(e)} width={230} height={300}/>

        //     </div>
        // </>

        <div className={style.emojiContainer}> 

            <div className={style.emojiWrapper}  ref={emojiRef} onBlur={()=> console.log(handleOpen())}> 
                <EmojiPicker
                   
                    theme="dark"
                    onEmojiClick={handleClickOnEmoji}
                    width={230}
                    height={300}
                    open={open}
                />
            </div>

        </div>
    )
}