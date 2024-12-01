import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Intro} from './pages/intro'
import { Home } from './pages/home';
import {MyNavBar} from './components/navbar'
import { Login } from './pages/login';
import { Register } from './pages/register';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './store/reducers/auth';

function App() {

  const [showNavbar, setShowNavbar] = useState(true);
  const dispatch = useDispatch<any>()

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])

  return (
    <div className="App">
      <BrowserRouter>
      {showNavbar && <MyNavBar />}
        <Routes>
          <Route path="/" element={<Intro setShowNavbar={setShowNavbar} />} />
          <Route path="/home" element={<Home setShowNavbar={setShowNavbar} />} />
          <Route path="/login" element={<Login setShowNavbar={setShowNavbar} />} />
          <Route path="/register" element={<Register setShowNavbar={setShowNavbar} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

