import React, { useLayoutEffect} from 'react';
import Alert from '../components/alert';
import { Footer } from '../components/footer';
import { Container } from 'react-bootstrap';

export const Home = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
  return (
    <div>
      <div className="backgroundContainer">
      <Container>
      <Alert />
      </Container>
      </div>
     <Footer />
     </div>
  );
}
