import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { Notification } from "../../../types/types"
import { useNavigate } from "react-router-dom";

interface NotificationProps {
    notif: Notification
}
export const SingleNotification = ({ notif }: NotificationProps) => {
    
  const navigate = useNavigate();
  const goToProfile = () => {
      navigate(`/home/${notif.from}`)
  }
  return (
        <ListItem
          key={notif.createdAt.toString() + notif.from}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
        <ListItemAvatar onClick={() => goToProfile()} sx={{cursor: "pointer"}}>
          <Avatar>{notif.from[0].toUpperCase()}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${notif.from}`}
          secondary={new Date(notif.createdAt).toLocaleString()}
        />
        <Typography variant="body2">{notif.metadata}</Typography>
      </ListItem>
    )
}
