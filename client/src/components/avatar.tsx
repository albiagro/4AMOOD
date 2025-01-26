import { Link } from 'react-router-dom'
import avatarM from '../img/avatarM.png'
import avatarF from '../img/avatarF.png'
import { useSelector } from 'react-redux'

export const Avatar = () => {

    const auth = useSelector((state: any) => state.auth) 

    const avatarImgSrc = auth.currentUser?.userProfileImagePath ?  auth.currentUser?.userProfileImagePath : (auth.currentUser?.sex === "M" ? avatarM : avatarF)

    return (
        <div>
            <Link to={`/user/${auth.currentUser?.username}`}><img src= {avatarImgSrc} id="avatar" alt="avatar" height="30" width="30" /></Link>
        </div>
    )
}
