import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Intro} from './pages/intro'
import { Home } from './pages/home';
import {MyNavBar} from './components/navbar'
import { Login } from './pages/login';
import { Register } from './pages/register';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/reducers/auth';
import { MyUser } from './pages/myuser';
import { FindYourParty } from './pages/findyourparty';
import { MyParties } from './pages/myparties';
import { CreateParty } from './pages/createparty';
import { PartyDetails } from './pages/partydetails';
import { User } from './pages/user';
import { Support } from './pages/support';
import { About } from './pages/about';
import { VerifyEmail } from './pages/verifyemail';

function App() {

  const [showNavbar, setShowNavbar] = useState(true);
  const dispatch = useDispatch<any>()

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])

  const auth = useSelector((state: any) => state.auth)

  //TODO: when user is logged out, redirect to home - now route is not triggered because it exists only if user is logged in!

  return (
    <div className="App">
      <BrowserRouter>
      {showNavbar && <MyNavBar />}
        <Routes>
          <Route path="/" element={<Intro setShowNavbar={setShowNavbar} />} />
          <Route path="/home" element={<Home setShowNavbar={setShowNavbar} />} />
          <Route path="/login" element={<Login setShowNavbar={setShowNavbar} />} />
          <Route path="/register" element={<Register setShowNavbar={setShowNavbar} />} />
          <Route path={`/user/${auth.currentUser?.username}`} element={<MyUser setShowNavbar={setShowNavbar} />} /> 
          {auth.currentUser && <><Route path="/myparties" element={<MyParties setShowNavbar={setShowNavbar} />} /> </> }
          {auth.currentUser && <><Route path="/createparty" element={<CreateParty setShowNavbar={setShowNavbar} />} /> </> }
          {auth.currentUser && <><Route path="/findyourparty" element={<FindYourParty setShowNavbar={setShowNavbar} />} /> </> }
          {auth.currentUser && <><Route path="/parties/*" element={<PartyDetails setShowNavbar={setShowNavbar} />} /> </> }
          {auth.currentUser && <><Route path={`/users/*`} element={<User setShowNavbar={setShowNavbar} />} />  </> }
          <Route path="/about" element={<About setShowNavbar={setShowNavbar} />} />
          <Route path="/support" element={<Support setShowNavbar={setShowNavbar} />} />
          <Route path="/verify/*" element={<VerifyEmail setShowNavbar={setShowNavbar} />} />
          <Route path="*" element={<Home setShowNavbar={setShowNavbar} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

