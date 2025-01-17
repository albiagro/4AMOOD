import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/reducers/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { Footer } from "../components/footer";

export const Register = ({
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

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [sex, setSex] = useState("");
  const [birthday, setBirthday] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch<any>();

  const onRegister = (e: any) => {
    e.preventDefault();
    dispatch(register({ name, surname, sex, birthday, username, password, email })).then(
      (action: any) => {
        if (action.error === null || action.error === undefined) {
          localStorage.setItem("accessToken", action.payload.token);
          navigate("/home");
        } else {
          setError(action.payload);
        }
      }
    );
  };

  return (
    <div>
      <div className="backgroundContainer">
      {/* If user is logged in, redirect to homepage */}
      {auth.currentUser && (
        <>
          <Navigate to="/home"></Navigate>
        </>
      )}
      <Form onSubmit={onRegister}>
      <Form.Group className="mb-3" controlId="personalData">
        <Form.Label>Name</Form.Label>
        <Form.Control type="input" placeholder="Enter name" onChange={(e) => setName(e.target.value)}/>
        <Form.Label>Surname</Form.Label>
        <Form.Control type="input" placeholder="Enter surname" onChange={(e) => setSurname(e.target.value)}/>
        <Form.Label>Your birthday</Form.Label>
        <Form.Control type="date" onChange={(e) => setBirthday(e.target.value)}/>      
      </Form.Group>  
      <Form.Group className="mb-2" controlId="sexData">
        <Form.Check name="sex" inline type="radio" label="M" onChange={(e) => e.target.value ? setSex("M") : setSex("")}/>
        <Form.Check name="sex" inline type="radio" label="F" onChange={(e) => e.target.value ? setSex("F") : setSex("")}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="loginData">
      <Form.Label>Username</Form.Label>
      <Form.Control type="input" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
        <Form.Text className="text-muted">
        <Form.Label>We'll never share your email with anyone else.</Form.Label>
        </Form.Text>
      </Form.Group>  
      </Form.Group>    
      
      <Button variant="info" type="submit">
        Register
      </Button>  
    </Form>
    <Form.Label className="errorLabel">{error}</Form.Label>
    </div>
      <Footer />
    </div>
  );
};
