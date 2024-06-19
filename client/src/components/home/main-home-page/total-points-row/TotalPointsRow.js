import React from "react";

const TotalPointsRow = ({ myRanking, otherRanking }) => {
  return (
    <tr>
      <td></td>
      <td></td>
      <td>Total points:</td>
      <td>{myRanking.total}</td>
      {otherRanking && <td>Total points:</td>}
      {otherRanking && <td>{otherRanking.total}</td>}
    </tr>
  );
};

export default TotalPointsRow;
