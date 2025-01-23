import React, { useEffect, useLayoutEffect, useState} from 'react';
import { Footer } from '../components/footer';
import { Alert, Button, Container } from 'react-bootstrap';
import api from '../axios';

export const VerifyEmail = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyToken = () => {
    api({
      method: "get",
      url: window.location.pathname,
      responseType: "json",
    })
      .then(function (response) {
        setMessage(response.data.message);
      })
      .catch((error) => console.log(error)); //do nothing
  }
  
  return (
    <div>
      <div className="backgroundContainer">
        <Container>
          {message && (
            <div>
              <Alert variant="primary">
                <Alert.Heading>E-mail verification</Alert.Heading>
                {message}
              </Alert>{" "}
              <br />
              <Button href="/home">Go to home</Button>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
}
