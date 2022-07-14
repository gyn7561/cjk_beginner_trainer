import React from 'react';
import CharCardV2 from './CharCardV2';
import { Button } from '@material-ui/core';
import MusicLearner from './MusicLearner/MusicLearner';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Typing from './Typing/Typing';

function App() {
  // let [charSet, setCharSet] = React.useState(null);
  // let [mode, setMode] = React.useState("");


  // if (!mode) {
  //   return <div>
  //     <Button onClick={() => setCharSet("kana")}>假名</Button>
  //     <Button onClick={() => setCharSet("hangul")} >谚文</Button>
  //     <Button onClick={() => setCharSet("hanja")} >韩语汉字</Button>
  //     <Button onClick={() => setMode("music")} >MUSIC</Button>
  //   </div>;
  // }
  // if (mode === "music") {
  //   return <MusicLearner />
  // } else if (mode === "char") {
  //   return (
  //     <div>
  //       <CharCardV2 charSet={charSet} />
  //     </div>
  //   );
  // }



  return <Router>
    <div>


      {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/kana">
          <CharCardV2 charSet="kana" />
        </Route>
        <Route path="/hangul">
          <CharCardV2 charSet="hangul" />
        </Route>
        <Route path="/hanja">
          <CharCardV2 charSet="hanja" />
        </Route>
        <Route path="/music">
          <MusicLearner />
        </Route>
        <Route path="/typing">
          <Typing />
        </Route>
        <Route path="/">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/kana">假名</Link>
              </li>
              <li>
                <Link to="/hangul">谚文</Link>
              </li>
              <li>
                <Link to="/hanja">韩语汉字</Link>
              </li>
              <li>
                <Link to="/music">MUSIC</Link>
              </li>
              <li>
                <Link to="/typing">打字训练</Link>
              </li>
            </ul>
          </nav>
        </Route>
      </Switch>
    </div>
  </Router>;
}

export default App;
