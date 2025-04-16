import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Friend } from '../../../types/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendFriendRequest, unfriendUser } from '../../../actions/friends';

interface SingleFriendProps {
  friend: Friend;
}
export const SingleFriend = ({ friend }: SingleFriendProps) => {
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate(`/home/${friend.user.username}`);
  };

  const [isFriend, setIsFriend] = useState(true);
  const [isRequest, setIsRequest] = useState(false);
  const removeFriend = async () => {
    await unfriendUser(friend.user.username);
    setIsFriend(false);
  };

  const addFriend = async () => {
    await sendFriendRequest(friend.user.username);
    setIsRequest(true);
  };

  return (
    <ListItem
      key={friend.user.username}
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <ListItemAvatar onClick={() => goToProfile()}>
        <Avatar>{friend.user.username[0].toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={`${friend.user.username}`} />
      {isFriend ? (
        <Button onClick={() => removeFriend()} variant="outlined">
          Remove Friend
        </Button>
      ) : isRequest ? (
        <Button disabled={true} variant="outlined">
          Requested
        </Button>
      ) : (
        <Button onClick={() => addFriend()} variant="outlined">
          Add Friend
        </Button>
      )}
    </ListItem>
  );
  return <div>friend</div>;
};
