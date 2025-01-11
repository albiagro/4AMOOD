import React, {  useEffect, useLayoutEffect, useState} from 'react';
import { Footer } from '../components/footer';
import { useLocation } from 'react-router-dom';
import { IParty } from './myparties';
import api from '../axios';
import { Card, Col, Row } from 'react-bootstrap';
import partyImg from '../img/party.jpg'
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'

export const PartyDetails = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const location = useLocation();

  const [partyDetails, setPartyDetails] = useState<IParty | null>(null);

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

  useEffect(() => {
    getPartyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
                      {partyDetails?.description}{" "}
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
                      Description: <b>{partyDetails?.description}</b>
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
            </Row>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

