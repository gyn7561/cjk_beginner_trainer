import React from "react";
import * as Hangul from 'hangul-js';
import Keyboard from 'react-simple-keyboard';
import {Helmet} from "react-helmet";
import 'react-simple-keyboard/build/css/index.css';
import useLocalStorage from "../useStorage";
let Aromanize = require("aromanize");
let lv1 = require("../data/lv1.json");

let hangulMap = {
    "ㄱ": "r",
    "ㄲ": "R",
    "ㄴ": "s",
    "ㄷ": "e",
    "ㄸ": "E",
    "ㄹ": "f",
    "ㅁ": "a",
    "ㅂ": "q",
    "ㅃ": "Q",
    "ㅅ": "t",
    "ㅆ": "T",
    "ㅇ": "d",
    "ㅈ": "w",
    "ㅉ": "W",
    "ㅊ": "c",
    "ㅋ": "z",
    "ㅌ": "x",
    "ㅍ": "v",
    "ㅎ": "g",
    "ㅏ": "k",
    "ㅐ": "o",
    "ㅑ": "i",
    "ㅒ": "O",
    "ㅓ": "j",
    "ㅔ": "p",
    "ㅕ": "u",
    "ㅖ": "P",
    "ㅗ": "h",
    "ㅛ": "y",
    "ㅜ": "n",
    "ㅠ": "b",
    "ㅡ": "m",
    "ㅣ": "l"
}

function findKey(value) {
    for (let key in hangulMap) {
        if (hangulMap[key] === value) {
            return key;
        }
    }
}

function getDateString() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month}-${day}`;
}

let refreshTimer = null;
export default function () {

    let [todayCount, setTodayCount] = useLocalStorage("TYPING_COUNT_" + getDateString(), 0);
    let [allCount, setAllCount] = useLocalStorage("TYPING_COUNT_ALL", 0);
    let [word, setWord] = React.useState(null);
    let [input, setInput] = React.useState("");
    let [layoutName, setLayoutName] = React.useState("default");
    let keyboardRef = React.useRef(null);
    function onChange(input) {
        console.log("Input changed", input);
    }


    let assemble = Hangul.assemble(input);
    let correct = word && assemble === word.name;
    function checkInput() {
        if (word && assemble === word.name.replace(/-/g, "")) {
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(() => {
                setTodayCount((p) => p + 1);
                setAllCount((p) => p + 1);
                randomWord();
                setInput("");
            }, 1000);
        }
    }

    function randomWord() {
        console.log(lv1.allWords.length);
        let index = parseInt(Math.random() * lv1.allWords.length);
        let word = lv1.allWords[index];
        setWord(word);
        console.log(word);
        return word;
    }

    function playAudio() {
        console.log("playAudio");
        if (word) {
            let audio = new Audio(`https://learn.dict.naver.com/nvoice?speaker=mijin&service=new-wordbook&domain=naver&from=pc&speech_fmt=mp3&text=${encodeURIComponent(word.name)}&vcode=`);
            audio.play();
        }
    }

    React.useEffect(() => {
        setWord(randomWord());
    }, []);

    React.useEffect(() => {
        playAudio();
    }, [word]);

    React.useEffect(() => {
        checkInput();
    }, [input]);

    React.useEffect(() => {
        function onKeyDown(e) {
            setInput((p) => {
                if (e.key === "Backspace") {
                    return p.slice(0, -1);
                }
                if (e.key === "Shift") {
                    setLayoutName("shift");
                    keyboardRef.current.addButtonTheme("{shift}", "hg-activeButton");
                }
                if (Object.values(hangulMap).includes(e.key)) {
                    keyboardRef.current.addButtonTheme(findKey(e.key), "hg-activeButton");
                    return p + findKey(e.key);
                }
                if (e.key === " ") {
                    setWord(p => {
                        return { ...p, ts: new Date().getTime() };
                    })
                }
                console.log(e.key);
                return p;
            });
        }
        function onKeyUp(e) {
            if (e.key === "Shift") {
                setLayoutName("default");
                keyboardRef.current.removeButtonTheme("{shift}", "hg-activeButton");
            }

            if (Object.values(hangulMap).includes(e.key)) {
                keyboardRef.current.removeButtonTheme(findKey(e.key), "hg-activeButton");
            }
        }
        window.addEventListener('keydown', onKeyDown); // 添加全局事件
        window.addEventListener('keyup', onKeyUp); // 添加全局事件
        return () => {
            window.removeEventListener('keydown', onKeyDown); // 销毁
            window.removeEventListener('keyup', onKeyUp); // 销毁
        };
    }, []);

    let hangulList = word ? Hangul.disassemble(word.name) : [];
    let inputHangulList = input ? Hangul.disassemble(assemble) : [];

    let hanja = word ? lv1.words[word.name] : "";
    let roma = Aromanize.romanize(word?.name || "");
    return <div>
        <Helmet>
            <title>打字训练</title>
        </Helmet>
        {
            word && <div>
                <p style={{ textAlign: "center", fontSize: 20 }}> 今日计数:{todayCount} 总计数:{allCount}</p>
                <h2 style={{ textAlign: "center", fontSize: 55 , padding: 0, margin: 40}} onClick={playAudio}>{word.name} {hanja && `[${hanja}]`}</h2>
                <h4 style={{ textAlign: "center", fontSize: 45, padding: 0, margin: 20 }} onClick={playAudio}>{roma}</h4>
                <div style={{ textAlign: "center", fontSize: 15, padding: 0, margin: 0 }}>
                    查询:&nbsp;&nbsp;<a href={`https://korean.dict.naver.com/kozhdict/#/search?query=${encodeURIComponent(word.name)}`} target="_blank">NAVER MOBILE</a>&nbsp;&nbsp;
                    <a href={`https://zh.dict.naver.com/#/search?query=${encodeURIComponent(word.name)}`} target="_blank">NAVER PC</a>
                </div>
                <p style={{ textAlign: "center", fontSize: 20 }}>
                    {word.means}</p>

                <div style={{ textAlign: "center", fontSize: 20 }}>
                    {
                        hangulList.map((char, index) => {
                            return <span style={{ color: inputHangulList[index] === char ? "green" : (inputHangulList.length - 1 >= index ? "red" : "black") }}>{char}[{hangulMap[char]}]</span>
                        })
                    }
                </div>
                <div style={{ textAlign: "center", fontSize: 50, height: 70, color: correct ? "green" : "black" }}>
                    {assemble}
                </div>
                <div style={{ textAlign: "center", width: 800, marginLeft: "auto", marginRight: "auto" }}>
                    <Keyboard
                        keyboardRef={(r) => { keyboardRef.current = r }}
                        layoutName={layoutName}
                        layout={{
                            default: ['` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                                '{tab} ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ [ ] \\',
                                "{lock} ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ ; ' {enter}",
                                '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ , . / {shift}',
                                '.com @ {space}'],
                            shift: ['~ ! @ # $ % ^ & * ( ) _ + {bksp}',
                                '{tab} ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ { } |',
                                '{lock} ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ : " {enter}',
                                '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ < > ? {shift}',
                                '.com @ {space}'],
                        }}
                        onChange={onChange}
                        onKeyPress={(e) => {
                            console.log(e);
                        }}
                    />
                </div>
            </div>
        }
    </div>
}