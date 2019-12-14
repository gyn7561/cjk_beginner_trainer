import React from 'react';
import CharCard from './CharCard';
// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <div>
      <CharCard charSet="hangul" />
    <CharCard charSet="kana" />
    </div>
  );
}

export default App;
