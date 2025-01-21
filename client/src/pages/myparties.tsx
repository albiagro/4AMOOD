import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Party } from "../components/party";
import { Footer } from "../components/footer";
import api from "../axios";

export interface IParty {
  _id: String;
  userOrganizer: String;
  title: String;
  description: String;
  category: String;
  latitude: String;
  longitude: String;
  address: String;
  date: Date;
  privateParty: Boolean;
  guests: IGuest[];
  state: String;
  messages: IMessage[]
}

export interface IMessage {
  username: String,
  message: String
}

export interface INotification {
  _id: String,
  userOwner: String,
  datetime: Date,
  message: String,
  invite: Boolean,
  partyID: String,
  userToBeAccepted: String,
  read: Boolean
}

export interface IGuest {
  username: String,
  birthday?: Date,
  sex?: String,
  accepted?: Boolean
}

export const MyParties = ({
  setShowNavbar,
}: {
  setShowNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, []);

  const auth = useSelector((state: any) => state.auth);

  const [partiesListOrganizedByMe, setPartiesOrganizedByMe] = useState<IParty[] | null>(null);
  const [partiesListMeAsAGuest, setPartiesListMeAsAGuest] = useState<IParty[] | null>(null);

  const [loading, setLoading] = useState(false);

  const urlOrganizedByMe = `/parties/myparties?organizer=${auth.currentUser?.username}`;
  const urlMeAsAGuest = `/parties/myparties?guest=${auth.currentUser?.username}`;

  const getPartiesOrganizedByMe = () => {
    setLoading(true);
    api({
      method: "get",
      url: urlOrganizedByMe,
      responseType: "json",
    })
      .then(function (response) {
        setPartiesOrganizedByMe(response.data.map((doc: any) => ({ ...doc })));
        setLoading(false);
      })
      .catch((error) => console.log(error)); //do nothing
  };

  const getPartiesIWillPartecipate = () => {
    setLoading(true);
    api({
      method: "get",
      url: urlMeAsAGuest,
      responseType: "json",
    })
      .then(function (response) {
        setPartiesListMeAsAGuest(response.data.map((doc: any) => ({ ...doc })));
        setLoading(false);
      })
      .catch((error) => console.log(error)); //do nothing
  };

  useEffect(() => {
    getPartiesOrganizedByMe();
    getPartiesIWillPartecipate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      userFound = true;
    }
    return userFound;
  }

  return (
    <div>
      <div className="backgroundContainer">
      <Container>
      <Alert variant="primary" >
        <Alert.Heading>
          Parties organized by {auth.currentUser.username}
        </Alert.Heading>
        <p>
          Below you can find the parties organized by you. Just review them,
          update their details or send invites!
        </p>
        <hr />
        <p className="mb-0">
          Whenever you want, you can create new parties through the following
          button:
        </p>
        <br />
        <Button href="/createparty" id="btnCreateParty" variant="outline-info">
          Let's organize a party!
        </Button>
      </Alert>
      {!loading ? (
        <Row xs={1} md={4} className="g-8">
        {partiesListOrganizedByMe?.map((party) => (
          <Col>
            <br />
            <Party party={party} organizedByMe={true} partecipating={true} userToBeAccepted= {false}/>
          </Col>
        ))}
      </Row>) : (
      <Spinner animation="border" variant="info" />)}
      
      <Alert variant="primary" id="alert2" className="container">
        <Alert.Heading>Parties I will partecipate in</Alert.Heading>
        <p>
          Below you can find the parties organized by other people that you
          confirmed your partecipation for.
        </p>
        <hr />
        <p className="mb-0">
          Whenever you want, you can find new parties through the following
          button:
        </p>
        <br />
        <Button href="/findyourparty" variant="outline-info">
          Find your party!
        </Button>
      </Alert>
          
      {!loading && partiesListMeAsAGuest ? (
        <Row xs={1} md={4} className="g-8">
        {partiesListMeAsAGuest?.map((party) => (
          <Col>
            <br />
            <Party party={party} organizedByMe={false} partecipating={userPartecipating(party)} userToBeAccepted= {userToBeAccepted(party.guests)}/>
          </Col>
        ))}
      </Row> ) : (
      <Spinner animation="border" variant="info" />)}
      </Container>
      </div>
     <Footer />
     </div>
  );
};
