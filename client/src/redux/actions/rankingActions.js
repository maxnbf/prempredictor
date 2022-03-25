import axios from "axios";

// Register User
export const makeRanking = (body) => {
    localStorage.setItem('favoirte_team', body.favorite_team)
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .post("http://localhost:5000/api/ranking/ranking", body)
            .then((res) => {
                resolve(res)

            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};


export const getRanking = (ranking) => {
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .get(`http://localhost:5000/api/ranking/${ranking}/ranking`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};

export const getLiveRanking = (id) => {
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .get(`http://localhost:5000/api/ranking/live`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};


export const getAllRanking = () => {
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .get(`http://localhost:5000/api/ranking/leaderboard`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};


export const getFanRanking = (team) => {
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .get(`http://localhost:5000/api/ranking/${team}/rankings`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};



export const getCommunityRanking = () => {
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .get(`http://localhost:5000/api/ranking/community_ranking`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};






