import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../navbar/Navbar";
import HeaderRow from "./header-row/HeaderRow";
import PredictionContent from "./prediction-content/PredictionContent";
import { HomeContainer, MyPredictionTable } from "./style";
import TotalPointsRow from "./total-points-row/TotalPointsRow";
import { Grid } from "@mui/material";
import { indexToRowStyle, pointsToColorStyle } from "./helpers";
import logos from "../../../teamlogos/logodict";

const MainHomePage = ({ live, myRanking, otherRanking, username }) => {
  const user = useSelector((state) => state.auth.user_info);

  console.log("Live: ", live);
  return (
    <div>
      <Navbar username={user?.username} page={"prediction"}></Navbar>

      <Grid
        container
        spacing={0}
        border={1}
        margin={0}
        sx={{
          "& > .MuiGrid-item": {
            padding: "8px",
            border: ".25px solid gray",
          },
        }}
      >
        <React.Fragment>
          <Grid p={1} item xs={1} md={1} border={1}></Grid>
          <Grid p={1} item xs={4.5} md={4.5} border={1}>
            Live
          </Grid>
          <Grid p={1} item xs={4.5} md={4.5} border={1}>
            @{user.username}
          </Grid>
          <Grid p={1} item xs={2} md={2} border={1}>
            Points
          </Grid>
        </React.Fragment>

        {myRanking.ranking.map((team, index) => {
          let positionColor = indexToRowStyle(index);

          return (
            <React.Fragment>
              <Grid
                p={1}
                item
                xs={1}
                md={1}
                border={1}
                fontSize={12}
                display={"flex"}
                justifyContent={"center"}
              >
                {index + 1}
              </Grid>
              <Grid
                item
                xs={4.5}
                md={4.5}
                display={"flex"}
                width={"20px"}
                height={"40px"}
              >
                {logos[myRanking.ranking[index]]}
              </Grid>
              <Grid
                item
                xs={4.5}
                md={4.5}
                fontSize={14}
                border={1}
                display={"flex"}
                width={"20px"}
                height={"40px"}
              >
                {logos[team]}
              </Grid>
              <Grid p={1} item xs={2} md={2} border={1} fontSize={14}>
                {myRanking.points[index]}
              </Grid>
            </React.Fragment>
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
