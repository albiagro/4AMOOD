import React, { useLayoutEffect} from 'react';

export const Home = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
  return (
    <div className='background'>
    </div>
  );
}
