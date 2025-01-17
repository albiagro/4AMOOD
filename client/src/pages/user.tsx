import React, { useEffect, useLayoutEffect, useState} from 'react';
import { Footer } from '../components/footer';
import api from '../axios';
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { useSelector } from 'react-redux';
import { Alert, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

interface IUser {
  name: String,
  surname: String,
  sex: String,
  birthday: Date,
  username: String,
  password: String,
  email: String
}

export const User = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
  const location = useLocation();
  const auth = useSelector((state: any) => state.auth)
  const [userDetails, setUserDetails] = useState<IUser | null>(null)
  const avatarImgSrc = userDetails?.sex === "M" ? avatarM : avatarF 

  useEffect(() => {
    getUserDetails();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const getUserDetails = () => {
    const usernameToSearch = location.state.user

    api({
      method: "get",
      url: `users/${usernameToSearch}`,
      responseType: "json",
    })
      .then(function (response) {
        setUserDetails(response.data[0]);
      })
      .catch((error) => console.log(error)); //do nothing
  } 

  return (
    <div>
    <div className="backgroundContainer">
      {userDetails ? 
    <Card className="userCard" >
      <Card.Img variant="top" src={avatarImgSrc} />
      <Card.Body>
      <Card.Title>{userDetails?.username} </Card.Title>
        <Card.Text>
      </Card.Text>     
      </Card.Body>
    </Card> : <Alert variant="danger">
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

