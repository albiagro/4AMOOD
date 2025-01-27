import React, { useLayoutEffect } from 'react';
import '../App.css';
import { Button } from 'react-bootstrap';
import SEO from '../components/SEO';


export const Intro = ( {setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}  ) => {

  useLayoutEffect(() => {
    setShowNavbar(false);
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <SEO 
              title= '4AMood'
              description='Your ultimate hub for unforgettable parties and social connections is here!'
              name='4AMood'
              type='website'
              />
      <div className="introImage">
        <Button variant="info" href='/home' id='btnIntro'>Let's start</Button>
    </div>
    </div>
    
  );
}
