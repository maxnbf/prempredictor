import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { FriendRequest } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { acceptFriendRequest, rejectFriendRequest } from "../../../actions/friends";

interface SingleFriendRequestProps {
    friendRequest: FriendRequest
}

export const SingleFriendRequest = ({ friendRequest }: SingleFriendRequestProps) => {
    const navigate = useNavigate();
    const goToProfile = () => {
        navigate(`/home/${friendRequest.from}`)
    }

    const [pending, setPending] = useState("pending");

    const acceptNotifFriendRequest = () => {
        acceptFriendRequest(friendRequest.from).then(res => setPending("Accepted"));
    }

    const rejectNotifFriendRequest = () => {
        rejectFriendRequest(friendRequest.from).then(res => setPending("Rejected"));
    }

    return (
        <ListItem
            key={friendRequest.createdAt + friendRequest.from}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
           
        >
        <ListItemAvatar onClick={() => goToProfile()}>
          <Avatar>{friendRequest.from[0].toUpperCase()}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${friendRequest.from}`}
          secondary={new Date(friendRequest.createdAt).toLocaleString()}
        />
            {pending == "pending" ?
                <Box>
                    <Button size="small" color="primary" sx={{ mr: 1 }} onClick={() => acceptNotifFriendRequest()} variant="outlined">Accept</Button>
                    <Button size="small" color="error" onClick={() => rejectNotifFriendRequest()} variant="outlined">Reject</Button>
                </Box> :
                <Box> {pending} </Box>
            }
        </ListItem>
    )
}