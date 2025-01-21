import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { Footer } from "../components/footer";
import { IGuest } from "./myparties";
import api from "../axios";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Commercial"); // Default one
  const [date, setDate] = useState("");
  const [privateParty, setPrivateParty] = useState(false);
  const [error, setError] = useState("");

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLatitude(place.geometry.location?.lat().toString() || "");
        setLongitude(place.geometry.location?.lng().toString() || "");
        setAddress(place.formatted_address || "");
      } else {
        setError("Unable to retrieve location details.");
      }
    }
  };

  async function onCreate(e: any) {
    e.preventDefault();

    var guests: IGuest[] = [];
    const guest: IGuest = {
      username: auth.currentUser?.username,
      sex: auth.currentUser?.sex,
      birthday: auth.currentUser?.birthday,
      accepted: true,
    };
    guests.push(guest);

    const partyData = {
      userOrganizer: auth.currentUser?.username,
      title: title,
      description: description,
      category: category,
      latitude: latitude,
      longitude: longitude,
      address: address,
      date: date,
      privateParty: privateParty,
      guests: guests,
      state: "active",
      messages: [],
    };

    try {
      const response = await api.post("/parties", { ...partyData });
      if (response.status === 200) {
        navigate("/myparties");
      }
    } catch (error) {
      setError("An error occurred while creating the party.");
    }
  }

  return (
    <div>
      <div className="backgroundContainer">
        <Container>
          <Form onSubmit={onCreate}>
            <Form.Group className="mb-3" controlId="basicData">
              <Form.Label>Title of your party</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Form.Label>Full description of your party</Form.Label> <br />
              <Form.Control as="textarea" placeholder="Enter description" rows={3} onChange={(e) => setDescription(e.target.value)} />
              <Form.Label>Date of the party</Form.Label>
              <Form.Control type="date" onChange={(e) => setDate(e.target.value)} />
              <Form.Label>Genre of music</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Commercial">Commercial</option>
                <option value="Tech-house">Tech-house</option>
                <option value="Raggae">Raggae</option>
                <option value="Hip-hop">Hip-hop</option>
              </Form.Select>
            </Form.Group>

            {/* Google Maps Autocomplete */}
            <LoadScript googleMapsApiKey="AIzaSyDngUX_tiz4yev5YOyeTCAtAwd2CQGcKoQ" libraries={["places"]}>
              <Form.Group className="mb-3" controlId="location">
                <Form.Label>Pick your party location</Form.Label>
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <Form.Control type="text" placeholder="Enter location" />
                </Autocomplete>
                {latitude && longitude && (
                  <>
                    <Form.Label>
                      Selected Location: {address} (Lat: {latitude}, Lng: {longitude})
                    </Form.Label>
                  </>
                )}
              </Form.Group>
            </LoadScript>

            <Form.Group className="mb-2" controlId="privateOrPublic">
              <Form.Check
                name="access"
                inline
                type="radio"
                label="Private"
                onChange={(e) => (e.target.value ? setPrivateParty(true) : setPrivateParty(false))}
              />
              <Form.Check
                name="access"
                inline
                type="radio"
                label="Public"
                onChange={(e) => (e.target.value ? setPrivateParty(false) : setPrivateParty(true))}
              />
            </Form.Group>
            <Button variant="info" type="submit">
              Confirm
            </Button>
          </Form>
          <Form.Label className="errorLabel">{error}</Form.Label>
        </Container>
      </div>
      <Footer />
    </div>
  );
};