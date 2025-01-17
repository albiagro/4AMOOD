import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Logo } from "./logo";
import { Avatar } from "./avatar";
import {UserBadge} from "./userBadge"
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/auth";
import { Button } from "react-bootstrap";

export const MyNavBar = () => {
  const dispatch = useDispatch<any>();

  const signUserOut = () => {
    dispatch(logout());
  };

  const auth = useSelector((state: any) => state.auth);

  return (
    <Navbar expand="lg" className="bg-body-tertiary" variant="dark">
      <Container fluid>
        <Logo />
        <Navbar.Brand href="#"></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/home">
              <p className="links"> Home </p>
            </Nav.Link>
            {auth.currentUser === null ? 
              <>
                <Nav.Link href="/login">
                  <p className="links"> Login </p>
                </Nav.Link>
                <Nav.Link href="/register">
                  <p className="links"> Register </p>
                </Nav.Link>
              </> :
              <>
              <Nav.Link href="/findyourparty">
              <p className="links"> Find your party </p>
            </Nav.Link>
            <Nav.Link href="/myparties">
              <p className="links"> My parties </p>
            </Nav.Link>
            </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
      {auth.currentUser && (
        <>
          <Container fluid>
            <Nav className="ms-auto" style={{ maxHeight: "100px" }}>
              <div className="avatarAndSignOut">
                <Avatar />
                <UserBadge/>
                <Button
                  className='userBtn'
                  variant="info"
                  size="sm"
                  onClick={signUserOut}
                >
                  Sign Out
                </Button>
              </div>
            </Nav>
          </Container>
        </>
      )}
    </Navbar>
  );
};
