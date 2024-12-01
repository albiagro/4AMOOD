import React, { useLayoutEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {login} from "../store/reducers/auth"
import { useNavigate } from 'react-router-dom';


export const Login = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch<any>()

  const onLogin = (e : any) => {
    e.preventDefault()
    dispatch(login({username, password})).then((action : any) => {
      try {
        localStorage.setItem("accessToken", action.payload.token)
        navigate("/home")
      } catch (error) {
        console.log("Something went wrong during login! Error: " + error)
      }
      
    })
  }
  
  return (
    <div className='background'>
      <form onSubmit={onLogin}>
        <input placeholder='Username...' onChange={(e) => setUsername(e.target.value)}/>
        <input type='password' placeholder='Password...' onChange={(e) => setPassword(e.target.value)}/>
        <input type='submit' />
    </form>
    </div>
  );
}
