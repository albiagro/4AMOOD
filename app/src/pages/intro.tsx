import React from 'react';
import logo from '../img/mylogo.gif';
import '../App.css';

export const Intro = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" />
        <p>Let's start</p>
      </header>
    </div>
  );
}
