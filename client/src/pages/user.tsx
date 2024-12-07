import React, { useLayoutEffect, useState} from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { updateUser } from '../store/reducers/auth';

export const User = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

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

  const dispatch = useDispatch<any>();

  const onSubmit = (e : any) => {
    e.preventDefault();
    dispatch(updateUser({username: auth.currentUser?.username, name, surname, password, email })).then(
      (action: any) => {
        console.log(action)
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
  
  return (
    <div>
      {/* If user is not logged in anymore, redirect to homepage */}
      {!auth.currentUser && (
        <>
          <Navigate to="/home"></Navigate>
        </>
      )}
    <div className='background'>

        <Card className="myCard" style={{ width: '18rem' }}>
      <Card.Img variant="top" src={avatarImgSrc} />
      <Card.Body>
      <Card.Title>{auth.currentUser?.username} </Card.Title>
        <Card.Text>
        <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="personalData">
        <Form.Label>Name</Form.Label>
        <Form.Control {...props} type="input" placeholder={auth.currentUser?.name} onChange={(e) => setName(e.target.value)}/>
        <Form.Label>Surname</Form.Label>
        <Form.Control {...props} type="input" placeholder={auth.currentUser?.surname} onChange={(e) => setSurname(e.target.value)}/>      
      </Form.Group>  
      <Form.Group className="mb-3" controlId="loginData">
      <Form.Label>Username</Form.Label>
        <Form.Control {...props} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control {...props} type="email" placeholder={auth.currentUser?.email} onChange={(e) => setEmail(e.target.value)}/>
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>  
      </Form.Group>  
      <Button className="btnUser" onClick={() => switchEditMode()}> {buttonDescription} </Button>
      {editMode && <><Button className="btnUser" variant="primary" type="submit">
        Submit
      </Button></>}     
      </Form>
      </Card.Text>      
      <Form.Label className="errorLabel">{error}</Form.Label>    
      </Card.Body>
    </Card>
    </div>
    </div>
  );
}

