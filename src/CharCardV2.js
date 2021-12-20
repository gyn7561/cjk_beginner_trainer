import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import hangul from "./hangul";
import kana from "./kana";
import * as Hangul from 'hangul-js';
let lv1Hanja = require("./data/lv1.json");
let hanjaMap = require("./data/hanja.json");

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        fontSize: 70
    },
}));


export default function (props) {
    let { charSet } = props;
    const classes = useStyles();

    const [char, setChar] = React.useState("");
    const [input, setInput] = React.useState("");
    const [options, setOptions] = React.useState([]);
    const [showLatin, setShowLatin] = React.useState(false);

    useEffect(() => {
        init();
    }, []);

    function randomChar() {
        if (charSet === "hangul") {
            let index = parseInt(Math.random() * hangul.allChar.length);
            let char = hangul.allChar[index];
            function endWithComplexConsonant() {
                let arr = ["ㄳ", "ㄵ", "ㄶ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅄ"];
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (Hangul.search(char, element) !== -1) {
                        return true;
                    }
                }
                return false;
            }
            if (endWithComplexConsonant()) {
                if (Math.random() < 0.1) {
                    return char;
                } else {
                    return randomChar();
                }
            }
            return char;
        } else if (charSet == "kana") {
            let index = parseInt(Math.random() * kana.allChar.length);
            return kana.allChar[index];
        } else if (charSet === "hanja") {
            let index = parseInt(Math.random() * lv1Hanja.length);
            return lv1Hanja[index];
        }
    }

    function romanize(char) {
        if (charSet == "hangul") {
            return hangul.romanize(char);
        } else if (charSet == "kana") {
            return kana.romanize(char);
        }
    }

    function init() {
        let char = randomChar();
        setInput("");
        setChar(char);
        randomAnsers(char);
        setShowLatin(false);

    }

    function randomAnsers(char) {
        let result = [];
        let trueAnswer = hanjaMap[char][0];
        result.push({ opt: trueAnswer, right: true });
        while (result.length < 4) {
            let index = parseInt(Math.random() * lv1Hanja.length);
            let rndHanja = lv1Hanja[index];
            let opt = hanjaMap[rndHanja][0];
            if (trueAnswer !== opt) {
                result.push({ opt: opt, right: false });
            }
        }

        var randomNumber = function () {
            // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
            // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
            // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
            return 0.5 - Math.random()
        }
        result.sort(randomNumber);
        setOptions(result);
    }



    function onInput(e) {
        let value = e.target.value;
        setInput(value);
        if (romanize(char).toLowerCase() === value.toLowerCase()) {
            init();
        }
    }

    function renderDetail() {
        if (charSet === 'hangul') {
            let list = Hangul.disassemble(char);
            return <div>{list.map(c => <span>{c}</span>)}</div>
        }
    }

    function clickOption(answer) {
        if (answer.right) {
            setTimeout(() => {
                init();
            }, 3000);
        }
        answer.select = true;
        setOptions(JSON.parse(JSON.stringify(options)));
    }


    return <Card>
        <CardContent>
            <Typography align="center" className={classes.root}>
                {char}
                {showLatin && <span>-{romanize(char)}
                    {showLatin && renderDetail()}
                </span>}
                {/*- {Aromanize.romanize(char)} */}
            </Typography>
            {/* <FormControl fullWidth className={classes.margin} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">输入发音</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    value={input}
                    onChange={e => onInput(e)}
                    labelWidth={60}
                    placeholder="输入发音"
                />
            </FormControl> */}

            {
                options.map(o => <div style={{ width: "100%", textAlign: "center", marginTop: 20 }}>
                    <Button variant="contained" disabled={o.select && !o.right} color={o.select ? (o.right ? "secondary" : "") : "primary"} style={{ width: "90%" }} onClick={() => { clickOption(o) }}>
                        {o.opt}
                    </Button>
                </div>)
            }


        </CardContent>

        {/* <CardActions>
            <Button variant="contained" color="primary" onClick={() => setShowLatin(true)} >显示latin </Button>
        </CardActions> */}
    </Card>;
}

