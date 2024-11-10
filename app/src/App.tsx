import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Intro} from './pages/intro'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

