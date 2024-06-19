import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllRanking,
  getCommunityRanking,
  getFanRanking,
} from "../../redux/actions/rankingActions";
import Navbar from "../navbar/Navbar";
import "react-dropdown/style.css";

import LeaderboardTable from "./leaderboard-table/LeaderboardTable";
import CommunityRanking from "./community-ranking/CommunityRanking";
import { StyledDropdown } from "./style";

const LeaderBoard = () => {
  const { name, favorite_team } = useSelector((state) => state.auth.user_info);

  const [leaderboard, setLeaderboard] = useState(null);
  const [favLeaderboard, setFavLeaderboard] = useState(null);
  const [commRanking, setCommRanking] = useState(null);

  useEffect(() => {
    getAllRanking().then((res) => setLeaderboard(res.data));
    // getFanRanking(favorite_team).then(res => setFavLeaderboard(res.data))
    // getCommunityRanking().then(res => setCommRanking(res.data))
  }, []);

  const options = [
    { value: "all", label: "All Users" },
    { value: "club", label: `${favorite_team}'s Fans` },
    { value: "community", label: "Community Average" },
  ];
  const [dropdownLeaderboard, setDropdownLeaderboard] = useState(
    options[0].value
  );
  const onSelect = (option) => {
    setDropdownLeaderboard(option.value);
  };

  return (
    <div>
      <Navbar username={name} page={"leaderboard"}></Navbar>
      <StyledDropdown
        options={options}
        onChange={onSelect}
        value={dropdownLeaderboard}
        placeholder="Select an option"
      />

      <div>
        {dropdownLeaderboard === "all" && (
          <LeaderboardTable leaderboard={leaderboard} />
        )}
        {dropdownLeaderboard === "club" && (
          <LeaderboardTable leaderboard={favLeaderboard} />
        )}
        {dropdownLeaderboard === "community" && (
          <CommunityRanking ranking={commRanking} />
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
