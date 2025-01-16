import React, { useLayoutEffect } from 'react';
import '../App.css';
import { Button } from 'react-bootstrap';


export const Intro = ( {setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}  ) => {

  useLayoutEffect(() => {
    setShowNavbar(false);
    // eslint-disable-next-line
  }, [])

  return (
    <div className="introImage">
        <Button variant="info" href='/home' id='btnIntro'>Let's start</Button>
    </div>
  );
}
