import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../navbar/Navbar";
import HeaderRow from "./header-row/HeaderRow";
import PredictionContent from "./prediction-content/PredictionContent";
import { HomeContainer, MyPredictionTable } from "./style";
import TotalPointsRow from "./total-points-row/TotalPointsRow";
import { Grid } from "@mui/material";
import { indexToRowStyle, pointsToColorStyle } from "./helpers";

const MainHomePage = ({ live, myRanking, otherRanking, username }) => {
  const user = useSelector((state) => state.auth.user_info);

  console.log("Live: ", live);
  return (
    <div>
      <Navbar username={user?.username} page={"prediction"}></Navbar>

      <Grid container spacing={0} border={1} margin={0}>
        <Grid item xs={1} md={1} border={1}></Grid>
        <Grid item xs={4} md={4} border={1}>
          Live
        </Grid>
        <Grid item xs={4} md={4} border={1}>
          @{user.username}
        </Grid>
        <Grid item xs={3} md={3} border={1}>
          My points
        </Grid>
        {myRanking.ranking.map((team, index) => {
          let positionColor = indexToRowStyle(index);

          return (
            <Grid container>
              <Grid item xs={1} md={1} border={1}>
                {index + 1}
              </Grid>
              <Grid item xs={4} md={4} border={1}>
                {myRanking.ranking[index]}
              </Grid>
              <Grid item xs={4} md={4} border={1}>
                {team}
              </Grid>
              <Grid item xs={3} md={3} border={1}>
                {myRanking.points[index]}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <HomeContainer>
        <MyPredictionTable>
          <HeaderRow
            otherRanking={otherRanking}
            user={user}
            username={username}
            live={live}
          />
          <PredictionContent
            myRanking={myRanking}
            otherRanking={otherRanking}
            live={live}
          />
          <TotalPointsRow myRanking={myRanking} otherRanking={otherRanking} />
        </MyPredictionTable>
      </HomeContainer>
    </div>
  );
};

export default MainHomePage;
