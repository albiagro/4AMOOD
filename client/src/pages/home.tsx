import React, { useLayoutEffect} from 'react';
import { Footer } from '../components/footer';
import { Alert, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const Home = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const auth = useSelector((state: any) => state.auth);
  
  return (
    <div>
      <div className="backgroundContainer">
      <br />
      <Container>
      {auth.currentUser ? <Alert variant="primary">
      <Alert.Heading>Hey, {auth.currentUser.username}, Welcome back to <b>4AMood</b>! 🎉</Alert.Heading>
      <p>
      We’re thrilled to have you back! Ready to dive into the party scene?
      </p>
      <ul>
      <li><b>Find your next adventure</b> in the <b>"Find Your Party"</b> menu, where you can explore the hottest events happening near you.</li>
      <li><b>Create unforgettable memories</b> by organizing your own event through the <b>"My Parties"</b> menu—whether it's a private get-together or a public bash, the spotlight is yours!</li>
      <li><b>Follow and connect</b>: Stay in sync with friends and party hosts by following their profiles, and get real-time notifications when they announce new events. Just click on others users' username to view and follow him/her!</li>
    </ul>
      <hr />
      <p className="mb-0">
      The night is yours to shape. Let’s keep the energy high and the good times rolling! 🎶✨
      </p>
    </Alert> :
    <Alert variant="primary">
    <Alert.Heading>Welcome to <b>4AMood</b>! 🎉</Alert.Heading>
    <p>
    Your ultimate hub for unforgettable parties and social connections is here!
    </p>
    <p><b>4AMood</b> is the perfect platform to:</p>
    <ul>
      <li><b>Organize your own parties</b>: Whether private or public, create memorable events and share them with your friends or the community.</li>
      <li><b>Discover local events</b>: Explore active parties in your area and join the vibe that matches your mood.</li>
      <li><b>Follow and connect</b>: Stay in sync with friends and party hosts by following their profiles, and get real-time notifications when they announce new events.</li>
    </ul>
    <p>4AMood is where your night begins, connections are made, and memories are created.</p>
    <hr />
    <p className="mb-0">
    So, what are you waiting for? Let’s set the mood and keep the party going! 🎶✨
    </p>
  </Alert>}
      </Container>
      </div>
     <Footer />
     </div>
  );
}
