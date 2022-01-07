import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import Lyric from 'lyric-parser';
import LycPlayer from "../MusicLearner/LycPlayer";

let krAudioLists = [
    {
        musicSrc: 'mp3/바다 (BADA) - Find The Way (找到出路).mp3', name: "Find The Way", singer: "바다", __A: "GGGG"
    },
    {
        musicSrc: 'mp3/장화신고 노래할고양 - 눈의 꽃 (雪之花) (Live).mp3', name: "눈의 꽃", singer: "??"
    }
];




export default function () {

    let [audioLists, setAudioLists] = useState([]);
    let [musicData, setMusicData] = useState(null);
    let [currentTime, setCurrentTime] = useState(0);

    let [audioInstance, setAudioInstance] = useState();

    function onAudioProgress(info) {
        setCurrentTime(info.currentTime);
    }
    function onAudioPlay(info) {
        setMusicData(info);
    }

    function onTimeSelect(time) {
        audioInstance.currentTime = time;
    }

    useEffect(async () => {
        let thisAudioList = JSON.parse(JSON.stringify(krAudioLists));
        setAudioLists(thisAudioList);
    }, [krAudioLists]);

    return <>
        <LycPlayer musicData={musicData} currentTime={currentTime} onTimeSelect={onTimeSelect} />
        <ReactJkMusicPlayer
            getAudioInstance={(instance) => {
                setAudioInstance(instance);
            }}
            onAudioProgress={onAudioProgress}
            // onPlayIndexChange={onPlayIndexChange}
            // onAudioListsChange={onAudioListsChange}
            onAudioPlay={onAudioPlay}
            // autoPlay={false}
            mode="full"
            showLyric={true}
            audioLists={audioLists}
        />
    </>;
}