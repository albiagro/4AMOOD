import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/reducers/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { Footer } from "../components/footer";
import SEO from "../components/SEO";

export const Login = ({
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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch<any>();

  const onLogin = (e: any) => {
    e.preventDefault();
    dispatch(login({ username, password })).then((action: any) => {
      if (action.error === null || action.error === undefined) {
        setError("");
        localStorage.setItem("accessToken", action.payload.token);
        navigate("/home");
      } else {
        setError(action.payload);
      }
    });
  };

  return (
    <div>
      <SEO 
        title= '4AMood | Login'
        description="Welcome back! Let's login to 4AMood!"
        name='4AMood'
        type='website'
        />
      <div className="backgroundContainer">
      <br />
      {/* If user is logged in, redirect to homepage */}
      {auth.currentUser && (
        <>
          <Navigate to="/home"></Navigate>
        </>
      )}
      <Form onSubmit={onLogin} id="formLogin">
      <Form.Group className="mb-3" controlId="loginData">
      <Form.Label>Username</Form.Label>
      <Form.Control type="input" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
      </Form.Group>    
      
      <Button variant="info" type="submit">
        Login
      </Button>  
    </Form>
    <Form.Label className="errorLabel">{error}</Form.Label>
    </div>
      <Footer />
    </div>
  );
};
