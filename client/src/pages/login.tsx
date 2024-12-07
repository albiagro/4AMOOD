import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/reducers/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

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
      {/* If user is logged in, redirect to homepage */}
      {auth.currentUser && (
        <>
          <Navigate to="/home"></Navigate>
        </>
      )}
      <div className="background">
      <Form onSubmit={onLogin} id="formLogin">
      <Form.Group className="mb-3" controlId="loginData">
      <Form.Label>Username</Form.Label>
      <Form.Control type="input" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
      </Form.Group>    
      
      <Button variant="primary" type="submit">
        Submit
      </Button>  
    </Form>
    <Form.Label className="errorLabel">{error}</Form.Label>
      </div>
    </div>
  );
};
