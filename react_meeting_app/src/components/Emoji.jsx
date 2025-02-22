import style from "../Emoji.module.css";
import { IoThumbsUp } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { useState } from "react";
import { GoPlus } from "react-icons/go";

export default function Emoji({ emojiHandle }) {

    if (!emojiHandle) {
        console.error("emojiHandle is not passed or is undefined");
    }
    let [open, setOpen] = useState(false);

    return (
        <>
            <div className={style.emoParent}>
                <div><GoPlus /></div>
                <EmojiPicker className={style.allEmoji} open={open} />

            </div>
        </>
    )
}