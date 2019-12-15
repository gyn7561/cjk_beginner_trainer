import React from 'react';
import CharCard from './CharCard';
import { Button } from '@material-ui/core';
// import logo from './logo.svg';
// import './App.css';

function App() {
  let [charSet, setCharSet] = React.useState(null);

  if (charSet == null) {
    return <div>
      <Button onClick={() => setCharSet("kana")}>假名</Button>
      <Button onClick={() => setCharSet("hangul")} >谚文</Button>
    </div>;
  }

  return (
    <div>
      <CharCard charSet={charSet} />
    </div>
  );
}

export default App;
