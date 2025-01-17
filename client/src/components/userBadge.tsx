import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { INotification } from '../pages/myparties';
import { useEffect, useState } from 'react';
import api from '../axios';

export const UserBadge = () => {

  const auth = useSelector((state: any) => state.auth);
    
  const [notificationsList, setNotificationsList] = useState<INotification[] | null>(null);

  useEffect(() => {
    getNotification();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const getNotification = () => {
    api({
      method: "get",
      url: `/notifications?user=${auth.currentUser?.username}`,
      responseType: "json",
    })
      .then(function (response) {
        setNotificationsList(response.data.map((doc: any) => ({ ...doc })));
      })
      .catch((error) => console.log(error)); //do nothing
  } 

    const notificationsToBeRead = notificationsList?.filter(function (item : INotification) {
      return !item.read;
    }).length

    const redirectUser = () => {
      window.location.href = `/user/${auth.currentUser?.username}`
    }

  return (
    <Button variant="info" onClick={() => redirectUser()} className='userBtn' size="sm">
      {auth.currentUser?.username} <Badge bg="secondary">{notificationsToBeRead} </Badge>
      <span className="visually-hidden">unread messages</span>
    </Button>
  );
}