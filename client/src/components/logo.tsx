import { Link } from 'react-router-dom'
import logo from '../img/mylogo.jpg'

export const Logo = () => {
    return (
        <div>
            <Link to={("/home")}><img src= {logo} id= "logo" alt="logo" height="115" /></Link>
        </div>
    )
}