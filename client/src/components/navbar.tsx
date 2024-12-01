import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Logo} from '../img/logo'
import {Avatar} from '../img/avatar'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/reducers/auth';
import { Button } from 'react-bootstrap';

export const MyNavBar = () => {

  const dispatch = useDispatch<any>()

  const signUserOut = () => {
    dispatch(logout())   
}

const auth = useSelector((state: any) => state.auth)

  return (
    <Navbar expand="lg" className="ml-auto">
      <Container fluid>
        <Logo />
        <Navbar.Brand href="#"></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href='/home'><p className= 'links'> Home </p ></Nav.Link>
            {auth.currentUser === null && <><Nav.Link href='/login'><p className= 'links'> Login </p ></Nav.Link>
            <Nav.Link href='/register'><p className= 'links'> Register </p ></Nav.Link> </>}
            {auth.currentUser && (
                <>
            <Nav.Link href='/home'><p> {auth.currentUser?.username}</p></Nav.Link>
            <div className='avatarAndSignOut'>
            <Avatar />
            <Button variant="primary" size="sm" onClick={signUserOut}>Sign Out</Button>
            </div>
            </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}