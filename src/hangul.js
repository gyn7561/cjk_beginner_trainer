
var Aromanize = require("aromanize");

let all = [];
for (var i = 0; i < 11172; i++) {
    all.push(String.fromCharCode(i + 44032));
}
function romanize(char) {
    return Aromanize.romanize(char);
}
export default { allChar: all, romanize };