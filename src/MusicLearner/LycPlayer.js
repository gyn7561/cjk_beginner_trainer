
import Lyric, { HandlerParams } from 'lyric-resolver'

import React, { useEffect, useState } from 'react'
import "../MusicLearner/LycPlayer.css";

export default function ({ musicData, currentTime, onTimeSelect }) {

    let [lycData, setLycData] = useState("");
    let [lyricLines, setLyricLines] = useState(null);
    let [currentShow, setCurrentShow] = useState("");
    let [learnData, setLearnData] = useState(null);

    // alert(musicData);
    useEffect(() => {
        (async () => {
            if (musicData) {
                let lycUrl = musicData.musicSrc.replace(".mp3", ".lrc");
                let learnDataUrl = musicData.musicSrc.replace(".mp3", ".json");
                let res = await fetch(lycUrl);
                let lycData = await res.text();
                res = await fetch(learnDataUrl);
                let learnData = await res.json();
                lycData = lycData.split("\n").map((s => s.trim())).join('\n');
                let lyric = new Lyric(lycData, () => { });
                setLyricLines(lyric.lines);
                setLycData(lycData);
                setLearnData(learnData);
                console.log(learnData);
                console.log(lyric.lines);
            }
        })();
    }, [musicData]);

    function getLineIndex() {
        if (!lyricLines) {
            return -1;
        }
        for (let i = 0; i < lyricLines.length; i++) {
            let line = lyricLines[i];
            if (line.lineTime > currentTime * 1000) {
                return i - 1;
            }
        }
        console.log("currentIndex", currentTime, -1);
        return -1;
    }


    let currentIndex = getLineIndex();

    function reanderRemark(i) {
        if (learnData) {
            let remarkList = learnData.remarks[i.toString()];
            if (remarkList) {
                return <div className='remark-wrap'>{
                    remarkList.map(remark => {
                        let urls = [];
                        if (remark.url) {
                            if (typeof (remark.url) === "string") {
                                urls = [remark.url];
                            } else {
                                urls = remark.url;
                            }
                        }

                        return <div className='remark-detail'>
                            <span className='word'>{remark.word}</span>
                            {
                                remark.origin && <span className='origin'>[{remark.origin}]</span>
                            }
                            <span className='remark'>{remark.remark}</span>
                            {urls.map(url => <a href={url} target="_blank"  className='link'>参考</a>)}
                        </div>;
                    })
                }</div>;
            }
        }
        return <></>;
    }

    function renderLines() {
        if (!lyricLines) {
            return <></>;
        }
        return <div className='lyc-wrap'>
            <p className='lyc blank'></p>
            {
                lyricLines.map((line, i) => {
                    return <div className="lyc" diff={i - currentIndex} onClick={() => { onTimeSelect(line.lineTime / 1000) }}>

                        {i}: {line.txt}
                    </div>;
                })
            }
            <p className='lyc blank'></p>
        </div>;
    }

    useEffect(() => {
        var lycEl = document.querySelector(".lyc-wrap .lyc[diff='0']");
        if (lycEl) {
            lycEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
    }, [currentIndex]);

    return <div className='lyc-page'>
        <div className='lyc-content'>
            {
                renderLines()
            }
        </div>
        <div className='remark-cotent'>
            {reanderRemark(currentIndex)}
        </div>
    </div>;
};