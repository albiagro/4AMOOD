import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { Footer } from "../components/footer";
import { IGuest } from "./myparties";
import api from "../axios";

export const CreateParty = ({
  setShowNavbar,
}: {
  setShowNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, []);

  const auth = useSelector((state: any) => state.auth);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [category, setCategory] = useState("Commercial"); //default one
  const [date, setDate] = useState("");
  const [privateParty, setPrivateParty] = useState(false);
  const [error, setError] = useState("");

  function pickLocation() {
    navigator.geolocation.getCurrentPosition(success, errorLocation);
  }
  
  function success(position : any) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  }
  
  function errorLocation() {
    setError("Unable to retrieve your location");
  }

  async function onCreate(e: any) {
    e.preventDefault();

    var guests : IGuest[] = []
    const guest : IGuest = {
      username: auth.currentUser?.username,
      sex: auth.currentUser?.sex,
      birthday: auth.currentUser?.birthday,
      accepted: true
    }
    guests.push(guest)

    const partyData = {
    userOrganizer : auth.currentUser?.username,
    title: title,
    description: description,
    mood: mood,
    category: category,
    latitude: latitude,
    longitude: longitude,
    date: date,    
    privateParty: privateParty,
    guests: guests,
    state: "active"
    }

    var response
    
    try {
      response = await api.post('/parties', {
        ...partyData
    })
  
    if (response.status === 200) {
      navigate("/myparties");
    }
    } catch (error) {
      response && setError(response.data.message)
    }

  };

  return (
    <div>
      <div className="backgroundContainer">
      <Container>
      <Form onSubmit={onCreate}>
      <Form.Group className="mb-3" controlId="basicData">
        <Form.Label>Title of your party</Form.Label>
        <Form.Control type="text" placeholder="Enter description" onChange={(e) => setTitle(e.target.value)}/>
        <Form.Label>Mood of the party!</Form.Label>
        <Form.Control type="input" placeholder="Just anything: one keyword, one slogan..." onChange={(e) => setMood(e.target.value)}/>
        <Form.Label>Full description of your party</Form.Label>
        <Form.Label>(Please specify also the location of the party, as just your location will be saved)</Form.Label>
        <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)}/>       
        <Form.Label>Date of the party</Form.Label>
        <Form.Control type="date" onChange={(e) => setDate(e.target.value)}/>  
        <Form.Label>Genre of music</Form.Label>
        <Form.Select aria-label="Default select example" onChange={(e) => setCategory(e.target.value)}>
          <option value="Commercial">Commercial</option>
          <option value="Tech-house">Tech-house</option>
          <option value="Raggae">Raggae</option>
          <option value="Hip-hop">Hip-hop</option>
        </Form.Select>
      </Form.Group>  
      <Form.Group className="mb-2" controlId="accessData">
        <Form.Group className="mb-2" controlId="privateOrPublic">
          <Form.Check name="access" inline type="radio" label="Private" onChange={(e) => e.target.value ? setPrivateParty(true) : setPrivateParty(false)}/>
          <Form.Check name="access" inline type="radio" label="Public" onChange={(e) => e.target.value ? setPrivateParty(false) : setPrivateParty(true)}/>
        </Form.Group>
        <Form.Group className="mb-2" controlId="location">
        <Button variant="primary" onClick={() => pickLocation()}>Pick your location for the party</Button><br />
          {latitude && longitude && <><Form.Label>Your current position: {latitude} {longitude}</Form.Label></>}
        </Form.Group>
      </Form.Group>      
      <Button variant="primary" type="submit">
        Submit
      </Button>  
    </Form>
    <Form.Label className="errorLabel">{error}</Form.Label>
    </Container>   
    </div>
       <Footer />
       </div>
  );
};
