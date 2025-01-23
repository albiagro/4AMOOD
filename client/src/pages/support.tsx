import React, { useLayoutEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Footer } from '../components/footer';
import { Button, Card, Form } from 'react-bootstrap';

export const Support = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const form = useRef<any>(null);

  const sendEmail = (e : any) => {
    e.preventDefault();

    const currentForm = form.current;
    // this prevents sending emails if there is no form.
    // in case currentForm cannot possibly ever be null,
    // you could alert the user or throw an Error, here
    if (currentForm == null) return;

    const email_key = process.env.REACT_APP_EMAILJS_KEY

    if (email_key == null) return;

    emailjs.sendForm("service_552ms1d", 'template_tsm2gqh', currentForm, {
        publicKey: email_key,
      })
      .then(
        () => {
          alert("Message successfully sent. We will reach you very soon.");
          currentForm.reset()
        },
        (error : any) => {
          alert("An error occurred while sending your message. Error: " + error.text)
        },        
      );
  };

  function isButtonEnabled() : boolean {
    return !(name !== "" && surname !== "" && email !== "" && message !== "")
  }

  return (
    <div>
      <div className="backgroundContainer">
      <Card className="myCard" bg="info">
      <Card.Body>
        <Card.Title>
          Get in touch!
        </Card.Title>
        <Card.Text>
          Contact us for any issue or suggestion.
        </Card.Text>
      </Card.Body>
    </Card> <br/>
      <Form ref={form} onSubmit={sendEmail}>
        <Form.Label>Name</Form.Label>
        <Form.Control type="input" placeholder="Enter name" name="from_name" onChange={(e) => setName(e.target.value)}/>
        <Form.Label>Surname</Form.Label>
        <Form.Control type="input" placeholder="Enter surname" name="from_lastname" onChange={(e) => setSurname(e.target.value)}/>
        <Form.Label>E-mail</Form.Label>
        <Form.Control type="email" placeholder="Enter your e-mail" name="email" onChange={(e) => setEmail(e.target.value)}/>
        <Form.Label>Your message</Form.Label>
        <Form.Control as="textarea" placeholder="Enter your message..." rows={3} name="message" onChange={(e) => setMessage(e.target.value)}/> <br />
      <Button variant="info" type="submit" disabled={isButtonEnabled()}>
        Send message
      </Button>  
    </Form>
      </div>
     <Footer />
     </div>
  );
}
