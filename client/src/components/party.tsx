import { Button, Card, FormLabel } from 'react-bootstrap';
import { IGuest, IParty } from '../pages/myparties';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import partyImg from '../img/party.jpg'

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

  const auth = useSelector((state: any) => state.auth);

  const setUserAsGuest = () => {

    setPartecipateState(true)

    const guest : IGuest = {
      username: auth.currentUser.username,
      birthday: auth.currentUser.birthday,
      sex: auth.currentUser.sex,
      accepted: true
    }

    axios({
      method: "put",
      url: `/parties?partyID=${party._id}`,
      data: {guest: guest, add: true}
    })
      .then(function (response) {})
      .catch((error) => console.log(error)); //do nothing
  };

  const removeUserAsGuest = () => {

    setPartecipateState(false)
    
    axios({
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
        message: `User ${auth.currentUser.username} has requested to partecipate to your party ${party.description}`,
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
        axios({
          method: "put",
          url: `/parties?partyID=${party._id}`,
          data: {guest: guest, add: true}
        }),
        axios({
          method: "post",
          url: `/notifications`,
          data: newNotification
        })
      ]).then()
      .catch((error) => console.log(error)); //do nothing
  };

  const cancelParty = () => {
    axios({
      method: "put",
      url: `/parties?partyID=${party._id}`,
      data: {state: "canceled"}
    })

    window.location.reload()
  }

  var button 
  
  if (party.privateParty) {
    if (pendingState === false) {
      if (partecipateState) {
        button = <div>
      <FormLabel > Click to not partecipate </FormLabel>
      <Button className="btnPartecipate" variant="primary" onClick={() => removeUserAsGuest()}>
        No party 😟
      </Button>
      </div>
      }
      else {
        button = <div>
    <FormLabel >Click to ask to partecipate</FormLabel>
    <Button className="btnPartecipate" variant="primary" onClick={() => askToPartecipate()}>
      Ask to partecipate ❓
    </Button>
    </div>
      }      
    }
    else {      
        button = <div>
        <FormLabel >Waiting for approval</FormLabel>
      <Button className="btnPartecipate" variant="primary" disabled={true}>
        Request pending 🕓
      </Button>
      </div>
      }      
  }
  else {
    if (partecipateState === false) {
      button = <div>
      <FormLabel >Click to partecipate</FormLabel>
      <Button className="btnPartecipate" variant="primary" onClick={() => setUserAsGuest()}>
        Party!! 💣
      </Button>
      </div>
    }
    else {
      button = <div>
      <FormLabel > Click to not partecipate </FormLabel>
      <Button className="btnPartecipate" variant="primary" onClick={() => removeUserAsGuest()}>
        No party 😟
      </Button>
      </div>
    }
  }

  return (
    <Card className="myCard">
      <Card.Img variant="top" src={partyImg} />
      <Card.Body>
        <Card.Title>{party.description} {party.privateParty && "🔐"}</Card.Title>
        <Card.Text>
          Organizer: <b>{party.userOrganizer}</b><br />
          Date: <b>{party.date.toLocaleString().split('T')[0]}</b> <br />
          Category: <b>{party.category}</b> <br />
          State: <b>{party.state}</b>
        </Card.Text>        
        {!props.organizedByMe && button}
        <br />
        <Button variant="primary">More details</Button>
        {props.organizedByMe && <><span className='separator'> </span><Button onClick={() => cancelParty()} variant="outline-danger">Delete</Button></>}
      </Card.Body>
    </Card>
  );
}