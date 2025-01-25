import React, {  useEffect, useLayoutEffect, useState} from 'react';
import { Footer } from '../components/footer';
import { useNavigate, useParams } from 'react-router-dom';
import { IMessage, IParty } from './myparties';
import api from '../axios';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import partyImg from '../img/party.jpg'
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { useSelector } from 'react-redux';

export const PartyDetails = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const [partyDetails, setPartyDetails] = useState<IParty | null>(null);
  const [message, setMessage] = useState("");

  const auth = useSelector((state: any) => state.auth);

  const navigate = useNavigate();

  const { partyID } = useParams();

  const url = `/parties/${partyID}`

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

  // If I'm clicking to the link of username but it's myself, I will not show the user page, but the myuser page
  const urlToRedirect = partyDetails?.userOrganizer === auth.currentUser.username ? `/user/${auth.currentUser.username}` : `/users/${partyDetails?.userOrganizer}`

  const redirectToUserPage = () => {
    navigate(urlToRedirect, {state:{user: partyDetails?.userOrganizer}})
  }

  const redirectToGuestPage = (guestUsername : String) => {
    // If I'm clicking to the link of username but it's myself, I will not show the user page, but the myuser page
    const urlToRedirect = guestUsername === auth.currentUser.username ? `/user/${auth.currentUser.username}` : `/users/${guestUsername}`

    navigate(urlToRedirect, {state:{user: guestUsername}})
  }

  function userPartecipating() : boolean {
    var userFound = false;

    if (partyDetails?.privateParty) {
      partyDetails?.guests.forEach(element => {
        if (element.username === auth.currentUser?.username && element.accepted === true) 
        {
          userFound = true;
        }      
      });
    }
    else {
      userFound = true;
    }
    return userFound;
  }
  
  return (
    <div>
      <div className="backgroundContainer">
        {partyDetails && 
          <>
            {partyDetails.privateParty && !userPartecipating() ?
          <div>
          <Alert variant="danger">
            <Alert.Heading>Ooops! Not authorized</Alert.Heading>
            You are trying to get details about a private party that you are not partecipating in.
            Find the party at page "Find your party" and ask the organizer to approve you!
          </Alert>{" "}
          <br />
          <Button href="/findyourparty">Find your party</Button>
        </div> :
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
                    Organizer: <Button onClick={() => redirectToUserPage()} variant="info" size="sm">{partyDetails?.userOrganizer}</Button> <br />
                      Date:{" "}
                      <b>
                        {partyDetails?.date.toLocaleString().split("T")[0]}
                      </b>{" "}
                      <br />
                      Description: <i>{partyDetails?.description}</i>
                      <br />
                      Location: <b>{partyDetails?.address}</b> <br />
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
                        <Button onClick={() => redirectToGuestPage(guest.username)} variant="info" size="sm">{guest.username}</Button><span className='separator'> </span>
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
                      <Form.Control type="input" value={message} placeholder="Your message..." onChange={(e) => setMessage(e.target.value)}/>
                      <span className='separator'> </span>
                      <Button variant="info" type='submit'>🚀</Button>
                      </div>                        
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        }</>}
      </div>
      <Footer />
    </div>
  );
}

