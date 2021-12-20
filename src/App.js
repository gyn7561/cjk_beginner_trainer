import React from 'react';
import CharCardV2 from './CharCardV2';
import { Button } from '@material-ui/core';
// import logo from './logo.svg';
// import './App.css';

function App() {
  let [charSet, setCharSet] = React.useState(null);

  if (charSet == null) {
    return <div>
      <Button onClick={() => setCharSet("kana")}>假名</Button>
      <Button onClick={() => setCharSet("hangul")} >谚文</Button>
      <Button onClick={() => setCharSet("hanja")} >韩语汉字</Button>
    </div>;
  }

  return (
    <div>
      <CharCardV2 charSet={charSet} />
    </div>
  );
}

export default App;
