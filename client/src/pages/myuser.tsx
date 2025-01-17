import React, { useEffect, useLayoutEffect, useState} from 'react';
import { Button, Card, Col, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { updateUser } from '../store/reducers/auth';
import { Footer } from '../components/footer';
import { INotification } from './myparties';
import axios from 'axios';
import api from '../axios';

export const MyUser = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
  const auth = useSelector((state: any) => state.auth)

  const [name, setName] = useState(auth.currentUser.name)
  const [surname, setSurname] = useState(auth.currentUser.surname)
  const [email, setEmail] = useState(auth.currentUser.email)
  const [password, setPassword] = useState(auth.currentUser.password)
  const [editMode, setEditMode] = useState(false)
  const [buttonDescription, setButtonDescription] = useState('Edit')
  const [error, setError] = useState('')

  const [notificationsList, setNotificationsList] = useState<INotification[] | null>(null);

  useEffect(() => {
    getNotification();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const getNotification = () => {
    api({
      method: "get",
      url: `/notifications?user=${auth.currentUser?.username}`,
      responseType: "json",
    })
      .then(function (response) {
        setNotificationsList(response.data.map((doc: any) => ({ ...doc })));
      })
      .catch((error) => console.log(error)); //do nothing
  } 

  const dispatch = useDispatch<any>();

  const onSubmit = (e : any) => {
    e.preventDefault();
    dispatch(updateUser({username: auth.currentUser?.username, name, surname, password, email })).then(
      (action: any) => {
        if (!action.error === null || !action.error === undefined) {
          setError(action.payload);
        }
        else {
          switchEditMode()
        }
      }
    );
  }

  const switchEditMode = () => {
    buttonDescription === 'Edit' ? setButtonDescription('Exit') : setButtonDescription('Edit')
    if (editMode === false) {setEditMode(true)} 
    else {setEditMode(false)
    window.location.reload()}
  }

  const avatarImgSrc = auth.currentUser?.sex === "M" ? avatarM : avatarF  

  const props = {disabled : !editMode}
  
  const setNotificationRead = (notification : INotification) => {
    api({
      method: "put",
      url: `/notifications?ID=${notification._id}`,
      data: {messageRead : true}
    }).then()
    .catch((error) => console.log(error)); //do nothing
    
    getNotification();
  }

  const acceptPartecipationRequest = (notification : INotification) => {

    const newNotification = {
      userOwner: notification.userToBeAccepted,
      datetime: new Date(),
      message: `User ${auth.currentUser.username} has approved your request to partecipate to the party!`,
      invite: false,
      partyID: notification.partyID,
      userToBeAccepted: null,
      read: false
    }

    axios.all([        
      api({
        method: "put",
        url: `/parties?partyID=${notification.partyID}`,
        data: {guest: notification.userToBeAccepted, toAccept: true}
      }),
      api({
        method: "put",
        url: `/notifications?ID=${notification._id}`,
        data: {messageRead : true}
      }),
      api({
        method: "post",
        url: `/notifications`,
        data: newNotification
      })
    ]).then()
    .catch((error) => console.log(error)); //do nothing

    getNotification();
  }

  const denytPartecipationRequest = (notification : INotification) => {

    const newNotification = {
      userOwner: notification.userToBeAccepted,
      datetime: new Date(),
      message: `Unfortunately, user ${auth.currentUser.username} has not approved your request to partecipate to the party. Find more parties!`,
      invite: false,
      partyID: notification.partyID,
      userToBeAccepted: null,
      read: false
    }

    axios.all([        
      api({
        method: "put",
        url: `/parties?partyID=${notification.partyID}`,
        data: {guest: notification.userToBeAccepted, toAccept: false}
      }),
      api({
        method: "put",
        url: `/notifications?ID=${notification._id}`,
        data: {messageRead : true}
      }),
      api({
        method: "post",
        url: `/notifications`,
        data: newNotification
      })
    ]).then()
    .catch((error) => console.log(error)); //do nothing

    getNotification();
  }
  
  return (
    <div>
      <div className="backgroundContainer">
      {/* If user is not logged in anymore, redirect to homepage */}
      {!auth.currentUser && (
        <>
          <Navigate to="/home"></Navigate>
        </>
      )}

    <Row xs={1} md={3} className="g-8">
        <Col>
        <Card className="userCard" >
      <Card.Img variant="top" src={avatarImgSrc} />
      <Card.Body>
      <Card.Title>{auth.currentUser?.username} </Card.Title>
        <Card.Text>
        <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="loginData">
        <Form.Label>Name</Form.Label>
        <Form.Control {...props} type="input" defaultValue={auth.currentUser?.name} onChange={(e) => setName(e.target.value)}/>
        <Form.Label>Surname</Form.Label>
        <Form.Control {...props} type="input" defaultValue={auth.currentUser?.surname} onChange={(e) => setSurname(e.target.value)}/> 
      <Form.Label>Username</Form.Label>
        <Form.Control {...props} type="password" defaultValue={auth.currentUser?.password} onChange={(e) => setPassword(e.target.value)}/>
        <Form.Label>Email address</Form.Label>
        <Form.Control {...props} type="email" defaultValue={auth.currentUser?.email} onChange={(e) => setEmail(e.target.value)}/>
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>  
      <Button variant="info" className="btnUser" onClick={() => switchEditMode()}> {buttonDescription} </Button><span className='separator'> </span>
      {editMode && <><Button className="btnUser" variant="info" type="submit">
        Submit
      </Button></>}     
      </Form>
      </Card.Text>      
      <Form.Label className="errorLabel">{error}</Form.Label>    
      </Card.Body>
    </Card>
        </Col>
        <Col>
        <Card className="notificationCard">
        <Card.Body>
      <Card.Title>Messages </Card.Title>
        <Card.Text>
          {(notificationsList && notificationsList?.filter(function(not : INotification) {return not.invite === false && not.read === false}).length > 0) ? 
        (<ToastContainer className="position-static" >
          {notificationsList?.filter(function(not : INotification) {return not.invite === false && not.read === false}).map((notification : INotification) => (
                
                    <Toast style={{ width: '100%' }}>
                    <Toast.Header className='toastHeader'>
                      <strong className="me-auto">Admin</strong>
                      <small className="text-muted">{notification.datetime.toLocaleString().split('T')[0]} {notification.datetime.toLocaleString().split('T')[1].split(".")[0]}</small>
                    </Toast.Header>
                    <Toast.Body >{notification.message}<br/>
                    <Button onClick={() => setNotificationRead(notification)} variant="outline-success">Read</Button>
                    </Toast.Body>
                  </Toast>
                  ))}   
    </ToastContainer>) : (<p>No new messages.</p>)}
      </Card.Text>       
      </Card.Body>
          </Card>
        </Col>
        <Col>
        <Card className="notificationCard">
        <Card.Body>
      <Card.Title>Partecipation Requests</Card.Title>
        <Card.Text>

        {(notificationsList && notificationsList?.filter(function(not : INotification) {return not.invite && not.read === false}).length > 0) ? 
        (<ToastContainer className="position-static">
          {notificationsList?.filter(function(not : INotification) {return not.invite && not.read === false}).map((notification : INotification) => (
                
                    <Toast style={{ width: '100%' }}>
                    <Toast.Header>
                      <strong className="me-auto">{notification.userToBeAccepted}</strong>
                      <small className="text-muted">{notification.datetime.toLocaleString().split('T')[0]} {notification.datetime.toLocaleString().split('T')[1].split(".")[0]}</small>
                    </Toast.Header>
                    <Toast.Body>{notification.message} <br/>
                    <Button onClick={() => acceptPartecipationRequest(notification)} variant="outline-success">Accept</Button><span className='separator'> </span>
                    <Button onClick={() => denytPartecipationRequest(notification)} variant="outline-danger">Deny</Button>
                      </Toast.Body>                    
                  </Toast>
                  ))}   
    </ToastContainer>) : (<p>No new requests.</p>)}
        
      </Card.Text>       
      </Card.Body>
          </Card>
        </Col>
    </Row>
    </div>
    <Footer />
    </div>
  );
}

