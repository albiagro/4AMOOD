import React, {  useEffect, useLayoutEffect, useState} from 'react';
// import { useSelector } from 'react-redux';
import { Footer } from '../components/footer';
import { useLocation } from 'react-router-dom';
import { IParty } from './myparties';
import api from '../axios';
import { Card } from 'react-bootstrap';
import partyImg from '../img/party.jpg'

export const PartyDetails = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
//   const auth = useSelector((state: any) => state.auth);

  const location = useLocation();

  const [partyDetails, setPartyDetails] = useState<IParty | null>(null);

  const url = `/parties/${location.state.partyID}`

  const getPartyDetails = () => {
    api({
        method: "get",
        url: url,
        responseType: "json",
      }).then(function (response) {
        setPartyDetails(response.data[0])
      });
  }

  useEffect(() => {
    getPartyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div>
    <div className="backgroundContainer">
    {partyDetails && <>
    <Card className="myCard">
      <Card.Img variant="top" src={partyImg} />
      <Card.Body>
        <Card.Title>{partyDetails?.description} {partyDetails?.privateParty && "🔐"}</Card.Title>
        <Card.Text>
          Organizer: <b>{partyDetails?.userOrganizer}</b><br />
          Date: <b>{partyDetails?.date.toLocaleString().split('T')[0]}</b> <br />
          Category: <b>{partyDetails?.category}</b> <br />
          State: <b>{partyDetails?.state}</b>
        </Card.Text>
      </Card.Body>
    </Card></>}
    </div>
    <Footer />
    </div>
  );
}

