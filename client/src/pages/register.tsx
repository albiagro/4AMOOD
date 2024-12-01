import React, { useLayoutEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {register} from "../store/reducers/auth"
import { useNavigate } from 'react-router-dom';


export const Register = ({setShowNavbar} : {setShowNavbar : React.Dispatch<React.SetStateAction<boolean>>}) => {

  useLayoutEffect(() => {
    setShowNavbar(true);
    // eslint-disable-next-line
  }, [])

  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const dispatch = useDispatch<any>()

  const onRegister = (e : any) => {
    e.preventDefault()
    dispatch(register({name, surname, username, password, email})).then((action : any) => {
      try {
        localStorage.setItem("accessToken", action.payload.token)
        navigate("/home")
      } catch (error) {
        console.log("Something went wrong during registration! Error: " + error)
      }
      
    })
  }
  
  return (
    <div className='background'>
      <form onSubmit={onRegister}>
        <input placeholder='Name' onChange={(e) => setName(e.target.value)}/>
        <input placeholder='Surname...' onChange={(e) => setSurname(e.target.value)}/>
        <input placeholder='Username...' onChange={(e) => setUsername(e.target.value)}/>
        <input type='password' placeholder='Password...' onChange={(e) => setPassword(e.target.value)}/>
        <input placeholder='E-mail...' onChange={(e) => setEmail(e.target.value)}/>
        <input type='submit' />
    </form>
    </div>
  );
}
