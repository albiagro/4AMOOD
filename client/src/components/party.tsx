import { Button, Card, FormLabel } from 'react-bootstrap';
import { IGuest, IParty } from '../pages/myparties';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import partyImg from '../img/party.jpg'
import api from '../axios';
import { useNavigate } from 'react-router-dom';

interface Props {
    party: IParty,
    //Only if not organized by me, I show the button "I will partecipate in"
    organizedByMe : boolean,
    partecipating: boolean,
    userToBeAccepted: boolean
}

export const Party = (props: Props) => {
  const { party } = props;
  const [partecipateState, setPartecipateState] = useState(props.partecipating);
  const [pendingState, setPendingState] = useState(props.userToBeAccepted);

  const navigate = useNavigate();

  const auth = useSelector((state: any) => state.auth);

  const setUserAsGuest = () => {

    setPartecipateState(true)

    const guest : IGuest = {
      username: auth.currentUser.username,
      birthday: auth.currentUser.birthday,
      sex: auth.currentUser.sex,
      accepted: true
    }

    api({
      method: "put",
      url: `/parties?partyID=${party._id}`,
      data: {guest: guest, add: true}
    })
      .then(function (response) {})
      .catch((error) => console.log(error)); //do nothing
  };

  const removeUserAsGuest = () => {

    setPartecipateState(false)
    
    api({
      method: "put",
      url: `/parties?partyID=${party._id}`,
      data: {guest: auth.currentUser.username, add: false}
    })
      .then(function (response) {})
      .catch((error) => console.log(error)); //do nothing
  };

  const askToPartecipate = () => {

      setPendingState(true);

      const newNotification = {
        userOwner: party.userOrganizer,
        datetime: new Date(),
        message: `User ${auth.currentUser.username} has requested to partecipate to your party ${party.title}`,
        invite: true,
        partyID: party._id,
        userToBeAccepted: auth.currentUser.username,
        read: false
      }

      const guest : IGuest = {
        username: auth.currentUser.username,
        birthday: auth.currentUser.birthday,
        sex: auth.currentUser.sex,
        accepted: false
      }

      axios.all([        
        api({
          method: "put",
          url: `/parties?partyID=${party._id}`,
          data: {guest: guest, add: true}
        }),
        api({
          method: "post",
          url: `/notifications`,
          data: newNotification
        })
      ]).then()
      .catch((error) => console.log(error)); //do nothing
  };

  const cancelParty = () => {
    api({
      method: "put",
      url: `/parties?partyID=${party._id}`,
      data: {state: "canceled"}
    })

    window.location.reload()
  }

  const openPartyDetails = () => {
    navigate(`/parties/${party._id}`, {state:{partyID: party._id}})
  }

  var sectionPartecipate 
  
  if (party.privateParty) {
    if (pendingState === false) {
      if (partecipateState) {
        sectionPartecipate = <div>
      <FormLabel > Click to not partecipate </FormLabel>
      <Button className="btnPartecipate" variant="primary" onClick={() => removeUserAsGuest()}>
        No party 😟
      </Button>
      </div>
      }
      else {
        sectionPartecipate = <div>
    <FormLabel >Click to ask to partecipate</FormLabel>
    <Button className="btnPartecipate" variant="primary" onClick={() => askToPartecipate()}>
      Ask to partecipate ❓
    </Button>
    </div>
      }      
    }
    else {      
        sectionPartecipate = <div>
        <FormLabel >Waiting for approval</FormLabel>
      <Button className="btnPartecipate" variant="primary" disabled={true}>
        Request pending 🕓
      </Button>
      </div>
      }      
  }
  else {
    if (partecipateState === false) {
      sectionPartecipate = <div>
      <FormLabel >Click to partecipate</FormLabel>
      <Button className="btnPartecipate" variant="primary" onClick={() => setUserAsGuest()}>
        Party!! 💣
      </Button>
      </div>
    }
    else {
      sectionPartecipate = <div>
      <FormLabel > Click to not partecipate </FormLabel>
      <Button className="btnPartecipate" variant="primary" onClick={() => removeUserAsGuest()}>
        No party 😟
      </Button>
      </div>
    }
  }

  const getAccessToPartyDetails = () => {
    if (party.privateParty) {
      if (pendingState === false) {
        if (partecipateState) {
          return false;
        }
        else {
          return true;
        }
      }
      else 
      {
        return true;
      }
    }
    else {
      return false;
    }
  }

  return (
    <Card className="myCard">
      <Card.Img variant="top" src={partyImg} />
      <Card.Body>
        <Card.Title>{party.title} {party.privateParty && "🔐"}</Card.Title>
        <Card.Text>
          Organizer: <b>{party.userOrganizer}</b><br />
          Date: <b>{party.date.toLocaleString().split('T')[0]}</b> <br />
          Category: <b>{party.category}</b> <br />
          State: <b>{party.state}</b>
        </Card.Text>        
        {!props.organizedByMe && sectionPartecipate}
        <br />
        <Button disabled={getAccessToPartyDetails()} onClick={() => openPartyDetails()} variant="primary">More details</Button>
        {props.organizedByMe && <><span className='separator'> </span><Button onClick={() => cancelParty()} variant="outline-danger">Delete</Button></>}
      </Card.Body>
    </Card>
  );
}