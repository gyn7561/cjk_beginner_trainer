import React from "react";
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
    const [char, setChar] = React.useState(randomChar());
    const [input, setInput] = React.useState("");
    const [showLatin, setShowLatin] = React.useState(false);

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
        setInput("");
        setChar(randomChar());
        setShowLatin(false);
    }

    function onInput(e) {
        let value = e.target.value;
        setInput(value);
        if (romanize(char) === value) {
            init();
        }
    }

    function renderDetail() {
        if (charSet === 'hangul') {
            let list = Hangul.disassemble(char);
            return <div>{list.map(c => <span>{c}</span>)}</div>
        }
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
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">输入发音</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    value={input}
                    onChange={e => onInput(e)}
                    labelWidth={60}
                    placeholder="输入发音"
                />
            </FormControl>
        </CardContent>

        <CardActions>
            <Button variant="contained" color="primary" onClick={() => setShowLatin(true)} >显示latin </Button>
        </CardActions>
    </Card>;
}

