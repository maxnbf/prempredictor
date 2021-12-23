import axios from "axios";

// Register User
export const makeRanking = (ranking) => {
    // Reset any errors that may have occured in previous signup attempts
    return new Promise(function (resolve, reject) {
        axios
            .post("http://localhost:5000/api/ranking/ranking", ranking)
            .then((res) => {
                resolve(res)
                console.log(res)

            })
            .catch((err) => {
                reject(err)
                console.log('ERROR', err)
            });
    });
};

// export const liveTable = () => {
//     var axios = require("axios").default;

//     var options = {
//     method: 'GET',
//     url: 'https://heisenbug-premier-league-live-scores-v1.p.rapidapi.com/api/premierleague/table',
//     headers: {
//         'x-rapidapi-host': 'heisenbug-premier-league-live-scores-v1.p.rapidapi.com',
//         'x-rapidapi-key': '1c57e02111msh788bcae97a8aa2bp1fe287jsnb14f5e2f0780'
//     }
//     };

//     return new Promise(function (resolve, reject) {
//         axios.request(options).then(function (response) {
//            resolve(response.data);
//         }).catch(function (error) {
//             console.error(error);
//         });
//     });
// }

// 0: {team: 'Manchester City', played: 18, win: 14, draw: 2, loss: 2, …}
// 1: {team: 'Liverpool', played: 18, win: 12, draw: 5, loss: 1, …}
// 2: {team: 'Chelsea', played: 18, win: 11, draw: 5, loss: 2, …}
// 3: {team: 'Arsenal', played: 18, win: 10, draw: 2, loss: 6, …}
// 4: {team: 'West Ham', played: 17, win: 8, draw: 4, loss: 5, …}
// 5: {team: 'Manchester United', played: 16, win: 8, draw: 3, loss: 5, …}
// 6: {team: 'Tottenham', played: 15, win: 8, draw: 2, loss: 5, …}
// 7: {team: 'Wolverhampton Wanderers', played: 18, win: 7, draw: 4, loss: 7, …}
// 8: {team: 'Leicester', played: 16, win: 6, draw: 4, loss: 6, …}
// 9: {team: 'Aston Villa', played: 17, win: 7, draw: 1, loss: 9, …}
// 10: {team: 'Brentford', played: 16, win: 5, draw: 5, loss: 6, …}
// 11: {team: 'Brighton', played: 16, win: 4, draw: 8, loss: 4, …}
// 12: {team: 'Crystal Palace', played: 17, win: 4, draw: 8, loss: 5, …}
// 13: {team: 'Everton', played: 17, win: 5, draw: 4, loss: 8, …}
// 14: {team: 'Southampton', played: 17, win: 3, draw: 8, loss: 6, …}
// 15: {team: 'Leeds', played: 18, win: 3, draw: 7, loss: 8, …}
// 16: {team: 'Watford', played: 16, win: 4, draw: 1, loss: 11, …}
// 17: {team: 'Burnley', played: 15, win: 1, draw: 8, loss: 6, …}
// 18: {team: 'Norwich', played: 17, win: 2, draw: 4, loss: 11, …}
// 19: {team: 'Newcastle United', played: 18, win: 1, draw: 7, loss: 10, …}