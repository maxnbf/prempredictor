import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getRanking, getLiveRanking } from "../../redux/actions/rankingActions";
import MainHomePage from "./main-home-page/MainHomePage";
import NewUserHomePage from "../new-user/NewUserHomePage";

const Home = () => {
  const [myRanking, setOwnRanking] = useState(undefined);
  const [otherRanking, setOtherRanking] = useState(undefined);
  const [live, setLive] = useState(undefined);
  const ownUsername = useSelector((state) => state.auth.user_info.username);

  const { username } = useParams();

  console.log(username, ownUsername);

  useEffect(() => {
    getRanking(ownUsername).then((res) => setOwnRanking(res.data));
    if (username) {
      getRanking(username).then((res) => setOtherRanking(res.data));
    }

    getLiveRanking().then((res) => setLive(res.ranking));
  }, [ownUsername, username]);

  if (myRanking && live) {
    return (
      <MainHomePage
        live={live}
        myRanking={myRanking}
        otherRanking={otherRanking}
        username={username}
      />
    );
  } else if (myRanking === null) {
    return <NewUserHomePage />;
  } else {
    return <div></div>;
  }
};

export default Home;
