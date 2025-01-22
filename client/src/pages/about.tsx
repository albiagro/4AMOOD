import React, { useLayoutEffect} from 'react';
import { Footer } from '../components/footer';
import { Alert, Container } from 'react-bootstrap';

export const About = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])
  
  return (
    <div>
      <div className="backgroundContainer">
      <Container>
      <Alert variant="primary">
      <Alert.Heading>About 4AMood: Find Your Party</Alert.Heading>
      <p><b>What is 4AMood?</b></p>
      <p>4AMood is a dynamic web app designed to bring people together for the ultimate party experience. Whether you're planning a massive celebration or an intimate private gathering, 4AMood serves as a social network and meeting point for young individuals looking to connect and create unforgettable events.</p> <br/>

      <p><b>Who created 4AMood?</b></p>
      <p>4AMood was created by Alberto Agrò as part of an innovative project. Alberto envisioned a platform where young people could seamlessly organize and discover parties, making it easier than ever to celebrate life's best moments.</p> <br/>

      <p><b>How does 4AMood work?</b></p>
      <p>The platform allows users to:

      <ul>
      <li>Organize events: Create, customize, and share invitations for your next big bash or cozy hangout.</li>
      <li>Discover parties: Explore public events happening nearby and join the fun.</li>
      <li>Connect with others: Chat with fellow party-goers to create hype before a party or to review it afterwards, follow other users to stay updated about parties around you.</li>
      </ul></p><br/>

      <p><b>What makes 4AMood unique?</b></p>
      <p>4AMood stands out as a blend of social networking and event organization. It's more than just a tool; it's a vibrant community of young people who love celebrating and making connections.</p><br/>

      <p><b>Who is 4AMood for?</b></p>
      <p>The app is perfect for anyone who loves hosting or attending parties, from outgoing extroverts looking for the next big event to meticulous planners crafting the perfect private soirée.</p><br/>

      <p><b>How can I get started?</b></p>
      <p>Joining 4AMood is easy! Simply sign up, create your profile, and start planning or exploring parties. It's free, fun, and designed with you in mind.</p>
    </Alert>
      </Container>
      </div>
     <Footer />
     </div>
  );
}
