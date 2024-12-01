import React, { useLayoutEffect } from 'react';
import logo from '../img/mylogo.gif';
import '../App.css';


export const Intro = ( {setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}  ) => {

  useLayoutEffect(() => {
    setShowNavbar(false);
    // eslint-disable-next-line
  }, [])

  return (
    <div className="introImage">
        <img className= "introLogo" src={logo} alt="logo" />
        <p><a href= '/home'>Let's start</a></p>
    </div>
  );
}
