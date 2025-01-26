import React, { useEffect, useLayoutEffect, useState} from 'react';
import { Button, Card, Col, Form, Row, Toast, ToastContainer, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  
  const auth = useSelector((state: any) => state.auth)

  const [name, setName] = useState(auth.currentUser.name)
  const [surname, setSurname] = useState(auth.currentUser.surname)
  const [email, setEmail] = useState(auth.currentUser.email)
  const [password, setPassword] = useState(auth.currentUser.password)
  const [editMode, setEditMode] = useState(false)
  const [buttonDescription, setButtonDescription] = useState('Edit')
  const [error, setError] = useState('')

  const [file, setFile] = useState(null);

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

  //TO BE COMPLETED: user profile's image update

  const handleFileChange = (e : any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // User's image preview
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
  };

  // User's image new image update
  const handleSubmit = async (e : any) => {
    e.preventDefault();

    if (!file) {
      alert('You have not selected any file!');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      await api.post(`/users/upload/${auth.currentUser?.username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image has been successfully loaded!');
      window.location.reload()
    } catch (error) {
      console.error('Errore while loading users image:', error);
    }
  };

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

  const avatarImgSrc = auth.currentUser?.userProfileImagePath ?  auth.currentUser?.userProfileImagePath : (auth.currentUser?.sex === "M" ? avatarM : avatarF)

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
      message: `User ${auth.currentUser.username} has approved your request to partecipate to this party! You can find more details`,
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

  const openPartyDetails = (partyID : String) => {
    navigate(`/parties/${partyID}`, {state:{partyID: partyID}})
  }

  const sendNewVerificationLink = async function() {
    api({
      method: "post",
      url: `/verify/${auth.currentUser?.username}`,
      data: {name: auth.currentUser?.name, email: auth.currentUser?.email}
    })
    .then(function (response) {
      alert(response.data.message);
    })
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
<Container>
    <Row xs={1} md={3} className="g-8">
        <Col>
        <Card >
      <Card.Img variant="top" src={avatarImgSrc} />
      <Form onSubmit={handleSubmit}>
      <Form.Label style={{color:"black"}}>Update your user profile</Form.Label>
      <Form.Control type="file" onChange={handleFileChange} accept='image/*'/>
        <Button className="btnUser" variant="info" type="submit" size='sm'>Upload</Button>
      </Form> 
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
        <Form.Control {...props} type="email" defaultValue={auth.currentUser?.email} onChange={(e) => setEmail(e.target.value)}/> <br />
          <Form.Label style={{color:"black"}}>Email verified {auth.currentUser?.active ? "✔️" : "❌"}</Form.Label>
          {!auth.currentUser?.active && <Button variant="info" onClick={() => sendNewVerificationLink()}>Send new verification link</Button>}
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
          {(notificationsList && notificationsList?.filter(function(notification : INotification) {return notification.invite === false && notification.read === false}).length > 0) ? 
        (<ToastContainer className="position-static" >
          {notificationsList?.filter(function(notification : INotification) {return notification.invite === false && notification.read === false}).map((notification : INotification) => (
                
                    <Toast style={{ width: '100%' }}>
                    <Toast.Header className='toastHeader'>
                      <strong className="me-auto">Admin</strong>
                      <small className="text-muted">{notification.datetime.toLocaleString().split('T')[0]} {notification.datetime.toLocaleString().split('T')[1].split(".")[0]}</small>
                    </Toast.Header>
                    <Toast.Body >{notification.message} {notification.partyID && <Button onClick={() => openPartyDetails(notification.partyID)} variant='info' size='sm'>here</Button>}<br/>
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

        {(notificationsList && notificationsList?.filter(function(notification : INotification) {return notification.invite && notification.read === false}).length > 0) ? 
        (<ToastContainer className="position-static">
          {notificationsList?.filter(function(notification : INotification) {return notification.invite && notification.read === false}).map((notification : INotification) => (
                
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
</Container>
    </div>
    <Footer />
    </div>
  );
}

