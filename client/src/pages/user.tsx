import React, { useEffect, useLayoutEffect, useState} from 'react';
import { Footer } from '../components/footer';
import api from '../axios';
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { useSelector } from 'react-redux';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

interface IUser {
  name: String,
  surname: String,
  sex: String,
  birthday: Date,
  username: String,
  password: String,
  email: String
  following: String[]
}

export const User = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
  const location = useLocation();
  const usernameToSearch = location.state.user
  const auth = useSelector((state: any) => state.auth)
  const [userDetails, setUserDetails] = useState<IUser | null>(null)

  const isCurrentUserFollowing = auth.currentUser?.following?.includes(usernameToSearch)

  const [follow, setFollow] = useState(isCurrentUserFollowing)

  const avatarImgSrc = userDetails?.sex === "M" ? avatarM : avatarF 

  useEffect(() => {
    getUserDetails();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const getUserDetails = () => {    

    api({
      method: "get",
      url: `users/${usernameToSearch}`,
      responseType: "json",
    })
      .then(function (response) {
        setUserDetails(response.data);
      })
      .catch((error) => console.log(error)); //do nothing
  }

  const setUserFollow = () => {

    if (follow) {
      api({
        method: "put",
        url: `users/${auth.currentUser?.username}`,
        data: {userToUpdate: auth.currentUser?.username, userToRemove: usernameToSearch}
      })
        .then(function (response) {
          setFollow(false);
        })
        .catch((error) => console.log(error)); //do nothing
    }
    else
    {
      api({
        method: "put",
        url: `users/${auth.currentUser?.username}`,
        data: {userToUpdate: auth.currentUser?.username, userToFollow: usernameToSearch}
      })
        .then(function (response) {
          setFollow(true);
        })
        .catch((error) => console.log(error)); //do nothing
    }    
  }

  return (
    <div>
    <div className="backgroundContainer">
      {userDetails ? 
      <Container>
    <Card id='otherUserCard'>
      <Card.Img variant="top" src={avatarImgSrc} />
      <Card.Body>
      <Card.Title>{userDetails?.username} <Button onClick={() => setUserFollow()} variant="info">{follow ? "Unfollow" : "Follow"}</Button></Card.Title>
        <Card.Text>
          <p>(You will receive a new notification for each party organized by {userDetails?.username})</p>
          <p>Name: <b>{userDetails?.name}</b></p>
          <p>Surname: <b>{userDetails?.surname}</b></p>
          <p>Birthday: <b>{userDetails?.birthday.toLocaleString().split('T')[0]}</b></p>
      </Card.Text>     
      </Card.Body>
    </Card>
    </Container>
     : <Alert variant="danger">
        <Alert.Heading>User not found!</Alert.Heading>
        <p>
          Probably the user you are looking for does not exist anymore.
        </p>
      </Alert>}
    </div>
    <Footer />
    </div>
  );
}

