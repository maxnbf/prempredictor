import { useEffect, useState } from "react"
import { Friend } from "../../../types/types"
import { getFriends } from "../../../actions/friends";
import { useSelector } from "react-redux";
import { Button, List, Typography } from "@mui/material";
import { SingleFriend } from "./SingleFriend";

export const Friends = () => {
    const [friends, setFriends] = useState<Friend[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showAllFriends, setShowAllFriends] = useState(false);
    const username = useSelector((state: any) => state.auth.user_info.username);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const friendsResponse = await getFriends(username)
            setFriends(friendsResponse)
            setIsLoading(false)
        }

        fetchData()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }
    return <>
    <Typography variant="h6" gutterBottom>
      Friends ({friends?.length})
    </Typography>

    {!friends || friends.length === 0 ? (
      <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
        Nothing to see at this time.
      </Typography>
    ) : (
      <List>
        {(showAllFriends ? friends : friends.slice(0, 3)).map((friend) =>
          <SingleFriend friend={friend} />
        )}
        {friends?.length > 3 && (
          <Button onClick={() => setShowAllFriends(!showAllFriends)}>
            {showAllFriends ? "See less" : "See more"}
          </Button>
        )}
      </List>
        )}
        </>
}