import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { acceptFriendRequest, getFriendStatus, sendFriendRequest, unfriendUser } from "../../../actions/friends";
import { FriendRequest, FriendRequestType } from "../../../types/types";

interface FriendButtonProps {
    activeUser: string,
    otherUsername: string
}

export const FriendButton = ({ activeUser, otherUsername }: FriendButtonProps) => { 

    const [isFriends, setIsFriends] = useState<boolean>(false);
    const [friendRequest, setFriendRequest] = useState<FriendRequest | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const friendStatus = await getFriendStatus(otherUsername)
            setIsFriends(friendStatus.isFriends)
            setFriendRequest(friendStatus.request)
            setIsLoading(false)
        }
        
        fetchData()
    }, [])


    const removeFriend = async (user: string) => {
        await unfriendUser(user)
        setIsFriends(false)
    }

    const acceptRequest = async (from: string) => {
        await acceptFriendRequest(from)
        setIsFriends(true)     
    }

    const sendRequest = async (to: string) => {
        await sendFriendRequest(to)
        setFriendRequest({from: activeUser, to: to, state: FriendRequestType.REQUEST, createdAt: new Date()})
    }

    if (isLoading) {
        return <></>
    }

    if (isFriends) {
        return <Button variant="outlined" onClick={() => removeFriend(otherUsername)}>Remove Friend</Button>
    } else if (friendRequest) {
        if (friendRequest.to == activeUser && friendRequest.from == otherUsername) {
            return <Button variant="outlined" onClick={() => acceptRequest(friendRequest.from)}>Accept Request</Button>
        } else {
            return <Button variant="outlined" disabled={true}>Pending</Button>
        }
    } else {
        return <Button variant="outlined" onClick={() => sendRequest(otherUsername)}>Add Friend</Button>
    }
}