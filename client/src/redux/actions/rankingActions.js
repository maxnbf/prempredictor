import axios from "axios";

// Register User
export const makeRanking = (data) => {
  console.log(data);
  return new Promise(function (resolve, reject) {
    axios
      .post("http://localhost:9000/api/user/ranking", data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log("ERROR", err);
      });
  });
};

export const getRanking = (user) => {
  // Reset any errors that may have occured in previous signup attempts
  return new Promise(function (resolve, reject) {
    axios
      .get(`http://localhost:9000/api/user/${user}/ranking`)
      .then((res) => {
        console.log("IN HERE");
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log("ERROR", err);
      });
  });
};

export const getLiveRanking = (id) => {
  // Reset any errors that may have occured in previous signup attempts
  return new Promise(function (resolve, reject) {
    axios
      .get(`http://localhost:9000/api/user/live`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        console.log("ERROR", err);
      });
  });
};

export const getAllRanking = () => {
  // Reset any errors that may have occured in previous signup attempts
  return new Promise(function (resolve, reject) {
    axios
      .get(`http://localhost:9000/api/user/leaderboard`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log("ERROR", err);
      });
  });
};

export const getFanRanking = (team) => {
  // Reset any errors that may have occured in previous signup attempts
  return new Promise(function (resolve, reject) {
    axios
      .get(`http://localhost:9000/api/ranking/${team}/rankings`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log("ERROR", err);
      });
  });
};

export const getCommunityRanking = () => {
  // Reset any errors that may have occured in previous signup attempts
  return new Promise(function (resolve, reject) {
    axios
      .get(`http://localhost:9000/api/ranking/community_ranking`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log("ERROR", err);
      });
  });
};
