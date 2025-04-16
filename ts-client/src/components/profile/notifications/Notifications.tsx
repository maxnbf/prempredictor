import { useEffect, useState } from 'react';
import { Typography, Button, List } from '@mui/material';
import { NotificationsResponse, getNotifs } from '../../../actions/notifications';
import { FriendRequest, Notification } from '../../../types/types';
import { getAllFriendRequests } from '../../../actions/friends';
import { SingleNotification } from './SingleNotification';
import { SingleFriendRequest } from './SingleFriendRequest';

export const Notifications = () => {
  const [notifsData, setNotifsData] = useState<NotificationsResponse | undefined>(undefined);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showAllOthers, setShowAllOthers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const notifs = await getNotifs();
      const requests = await getAllFriendRequests();
      setNotifsData(notifs);
      setFriendRequests(requests);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading || !notifsData) {
    return <div>Loading...</div>;
  }

  const { notifs, newNotifs } = notifsData;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Notifications ({newNotifs} new)
      </Typography>

      {/* Friend Requests */}
      <Typography variant="subtitle1" gutterBottom>
        Friend Requests
      </Typography>
      {!friendRequests || friendRequests.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
          Nothing to see at this time.
        </Typography>
      ) : (
        <List>
          {(showAllFriends ? friendRequests : friendRequests.slice(0, 3)).map((friendRequest) => (
            <SingleFriendRequest friendRequest={friendRequest} />
          ))}
          {friendRequests?.length > 3 && (
            <Button onClick={() => setShowAllFriends(!showAllFriends)}>
              {showAllFriends ? 'See less' : 'See more'}
            </Button>
          )}
        </List>
      )}

      {/* Other Notifications */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
        Other Notifications
      </Typography>
      {notifs.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
          Nothing to see at this time.
        </Typography>
      ) : (
        <List>
          {(showAllOthers ? notifs : notifs.slice(0, 3)).map((notif) => (
            <SingleNotification notif={notif} />
          ))}
          {notifs.length > 3 && (
            <Button onClick={() => setShowAllOthers(!showAllOthers)}>
              {showAllOthers ? 'See less' : 'See more'}
            </Button>
          )}
        </List>
      )}
    </>
  );
};
