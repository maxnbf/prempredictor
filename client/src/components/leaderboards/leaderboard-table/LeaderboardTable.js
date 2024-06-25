import React from "react";
import { Link } from "react-router-dom";
import logos from "../../../teamlogos/logodict";
import {
  Leaderboard,
  PointsCol,
  PointsHeader,
  RankCol,
  Row,
  Table,
  UsernameCol,
  UsernameColLogo,
  UsernameColText,
  UsernameHeader,
} from "./style";

const LeaderboardTable = ({ leaderboard }) => {
  return leaderboard ? (
    <Leaderboard>
      <Table>
        <tr>
          <td></td>
          <UsernameHeader>Username</UsernameHeader>
          <PointsHeader>Points</PointsHeader>
        </tr>
        {leaderboard?.map((user, index) => {
          return (
            <Row key={index}>
              <RankCol>{index + 1}</RankCol>
              <UsernameCol>
                <UsernameColText to={`/home/${user.username}`}>
                  @{user.username}
                </UsernameColText>
                <UsernameColLogo>{logos[user.favorite]}</UsernameColLogo>
              </UsernameCol>
              <PointsCol>{user.total}</PointsCol>
            </Row>
          );
        })}
      </Table>
    </Leaderboard>
  ) : null;
};

export default LeaderboardTable;
