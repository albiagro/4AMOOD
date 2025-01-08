import React, { useLayoutEffect, useState} from 'react';
import { Button, Col, Container, Form, FormGroup, Row, Spinner } from 'react-bootstrap';
import { IGuest, IParty } from './myparties';
import { useSelector } from 'react-redux';
import { Party } from '../components/party';
import { Footer } from '../components/footer';
import api from '../axios';

export const FindYourParty = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const [loading, setLoading] = useState(false);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState<any>(1);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Geolocation not supported");
  }
  
  function success(position : any) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  }
  
  function error() {
    console.log("Unable to retrieve your location");
  }

  const auth = useSelector((state: any) => state.auth);

  const [partiesList, setParties] = useState<IParty[] | null>(null);

  async function onSearch(e: any) {
    e.preventDefault();
    setLoading(true);

    const url = `/parties?currentUser=${auth.currentUser?.username}&minLat=${boundingBox.minLat}&maxLat=${boundingBox.maxLat}&minLon=${boundingBox.minLon}&maxLon=${boundingBox.maxLon}&date=${date}`

    api({
      method: "get",
      url: url,
      responseType: "json",
    }).then(function (response) {
      setParties(
          response.data.map(
           (doc: any) =>
             ({...doc})
         ));
         setLoading(false);
      }
    ).catch(error => console.log(error)) //do nothing

  };

  function findBoundingCoordinates(
    lat: number,
    lon: number,
    distanceKm: number
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
    const R = 6371; // Raggio medio terrestre in km
    const angularDistance = distanceKm / R; // Distanza angolare in radianti

    // Converti latitudine e longitudine in radianti
    const latRad = toRadians(lat);
    const lonRad = toRadians(lon);

    // Calcola latitudine minima e massima
    let minLat = latRad - angularDistance;
    let maxLat = latRad + angularDistance;

    // Assicurati che la latitudine sia tra -90 e 90 gradi
    minLat = Math.max(minLat, toRadians(-90));
    maxLat = Math.min(maxLat, toRadians(90));

    // Calcola longitudine minima e massima
    let minLon: number;
    let maxLon: number;

    if (minLat > toRadians(-90) && maxLat < toRadians(90)) {
        minLon = lonRad - angularDistance / Math.cos(latRad);
        maxLon = lonRad + angularDistance / Math.cos(latRad);
    } else {
        // Ai poli, la longitudine è arbitraria
        minLon = toRadians(-180);
        maxLon = toRadians(180);
    }

    // Converti i risultati in gradi
    return {
        minLat: toDegrees(minLat),
        maxLat: toDegrees(maxLat),
        minLon: toDegrees(minLon),
        maxLon: toDegrees(maxLon),
    };
}

// Funzioni di supporto per conversioni
function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
}

  const boundingBox = findBoundingCoordinates(latitude, longitude, distance);

  function userToBeAccepted(guests : IGuest[]) : boolean {
    var userFound = false;

    guests.forEach(element => {
      if (element.username === auth.currentUser?.username && element.accepted === false) 
      {
        userFound = true;
      }      
    });
    return userFound;
  }

  function userPartecipating(party : IParty) : boolean {

    var userFound = false;

    if (party.privateParty) {
      party.guests.forEach(element => {
        if (element.username === auth.currentUser?.username && element.accepted === true) 
        {
          userFound = true;
        }      
      });
    }
    else {
      userFound = party.guests.includes({username: auth.currentUser?.username})
    }
    return userFound;
  }
  
  return (
    <div >
      <div className="backgroundContainer">
      <Container>
        <Form onSubmit={onSearch}>
          <FormGroup className="mb-2" >
          <Form.Label>Distance from you:</Form.Label><span> </span>
          <Form.Label>{distance} km</Form.Label>
          <Form.Range value={distance} min="1" max="50" onChange={(e) => setDistance(e.target.value)}/>
            <Form.Label>Party date</Form.Label>
            <Form.Control type="date" placeholder="Enter date" onChange={(e) => setDate(e.target.value)}/>
            </FormGroup>
            <Button type="submit">Search</Button>
        </Form>

        {!loading ? ( 
        <Row xs={1} md={4} className="g-3">
        {partiesList?.map((party) => (
          <Col >
            <br />
            <Party party={party} organizedByMe={false} partecipating={userPartecipating(party)} userToBeAccepted={userToBeAccepted(party.guests)}/>
          </Col>
        ))}
      </Row>) : (
      <Spinner animation="border" variant="info" />)}
      </Container>
      </div>
    <Footer />
    </div>
  );
}