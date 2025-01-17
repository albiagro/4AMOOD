import React, {  useEffect, useLayoutEffect, useState} from 'react';
import { Footer } from '../components/footer';
import { useLocation } from 'react-router-dom';
import { IMessage, IParty } from './myparties';
import api from '../axios';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import partyImg from '../img/party.jpg'
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { useSelector } from 'react-redux';

export const PartyDetails = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const location = useLocation();

  const [partyDetails, setPartyDetails] = useState<IParty | null>(null);
  const [message, setMessage] = useState("");

  const auth = useSelector((state: any) => state.auth);

  const url = `/parties/${location.state.partyID}`

  const getPartyDetails = () => {
    api({
        method: "get",  
        url: url,
        responseType: "json",
      }).then(function (response) {
        setPartyDetails(response.data)
      });
  }

  const updateMessages = (e : any) => {
    e.preventDefault();    
    const newMessage : IMessage = {
      username: auth.currentUser.username,
      message: message
    }

    api({
      method: "put",
      url: `/parties?partyID=${partyDetails?._id}`,
      data: {message: newMessage}
    }).then(function () {
      getPartyDetails()      
    });

    setMessage("")
  }

  useEffect(() => {
    getPartyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyDetails]);
  
  return (
    <div>
      <div className="backgroundContainer">
        {partyDetails && (
          <>
            <Row xs={1} md={3} className="g-8">
              <Col>
                <Card className="myCard" >
                  <Card.Img variant="top" src={partyImg} />
                  <Card.Body>
                    <Card.Title>
                      {partyDetails?.title}{" "}
                      {partyDetails?.privateParty && "🔐"}
                    </Card.Title>
                    <Card.Text>
                      Organizer: <b>{partyDetails?.userOrganizer}</b>
                      <br />
                      Date:{" "}
                      <b>
                        {partyDetails?.date.toLocaleString().split("T")[0]}
                      </b>{" "}
                      <br />
                      Description: <i>{partyDetails?.description}</i>
                      <br />
                      Category: <b>{partyDetails?.category}</b> <br />
                      State: <b>{partyDetails?.state}</b>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="myCard" >
                  <Card.Body>
                    <Card.Title>
                      Guests
                    </Card.Title>
                    <Card.Text>
                      {partyDetails?.guests.map((guest) => (
                        <>    
                        {guest.sex === 'M' ? <img src={avatarM} alt='guestAvatar' height="30" width="30"/>
                        : <img src={avatarF} alt='guestAvatar' height="30" width="30"/>}
                        <p>{guest.username}</p>  
                        </>))}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="myCard" >
                  <Card.Body>
                    <Card.Title>
                      Messages
                    </Card.Title>
                    <Card.Text>
                      Post your message before or after the party to create hype! <br />
                      Please be respectful of everyone. <br /><br />
                      {partyDetails?.messages?.map((message) => (
                        <p><b>{message.username}: </b>{message.message}</p>
                        ))}
                    </Card.Text>
                    <Form onSubmit={updateMessages}>
                      <div style={{display: "flex"}}>
                      <Form.Control type="input" value={message} placeholder="Write your message..." onChange={(e) => setMessage(e.target.value)}/>
                      <span className='separator'> </span>
                      <Button variant="info" type='submit'>🚀</Button>
                      </div>                        
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

