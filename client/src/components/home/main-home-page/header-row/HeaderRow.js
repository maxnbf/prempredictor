import React from "react";
import { PointsHeader, TeamHeader } from "./style";

const HeaderRow = ({ otherRanking, user, username }) => {
  return (
    <tr>
      <td></td>
      <TeamHeader> Live Table </TeamHeader>
      <TeamHeader>
        {" "}
        {user?.username ? user?.username : username}'s Predicitons{" "}
      </TeamHeader>
      <PointsHeader> My Points</PointsHeader>
      {otherRanking && <TeamHeader> {username}'s Predicitons </TeamHeader>}
      {otherRanking && <PointsHeader>Their Points </PointsHeader>}
    </tr>
  );
};

export default HeaderRow;
