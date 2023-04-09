/**
 * This is the puzzle service file
 * This file takes input from the controller and directs it to the db.service file
 * The five functions are {@link patchLearnedLessons}, {@link getLearnedLessons},
 * {@link getGameStatistics}, {@link deleteGameStatistics}, and {@link filterInputQuery}
 * The main purpose of this service file is to perform the 'business' logic
 * Any errors will be caught by our try/catch block in our controller
 * @module
 */

import {CustomError, CustomErrorEnum} from "../models/error.model";

require('dotenv').config();
const axios = require('axios').default;
const basePuzzleUrl = process.env.PUZZLE_URL + '/api/v1/puzzles';
const baseUserActiveGamesUrl = process.env.USER_ACTIVE_GAMES_URL + '/api/v1/user/activeGames';
const baseUserGameStatisticsUrl = process.env.USER_GAME_STATISTICS_URL + '/api/v1/user/gameStatistics'


/**
 * This function takes in the input query and throws and error if no puzzles
 * are found to match the query
 * This function calls a helper function to create the inputQuery for the dataBase function
 * @param req
 */
async function getLearnedLessons(req:any) {

    let token = req.auth.payload;
    let totalStatsResponseBody;

    // retrieve user's total game statistics
    let totalStatisticsResponseCode = 0;
    await axios.get(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()) + "&dateRange=1111-11-11", {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        totalStatisticsResponseCode = response.status;
        if (response.status == 200){
            totalStatsResponseBody = response.data;
        }
    })
        .catch(function (error) {
            if (error.response){
                totalStatisticsResponseCode = error.response.status;
            }
        });

    if (totalStatisticsResponseCode != 200 && totalStatisticsResponseCode != 404){
        throw new CustomError(CustomErrorEnum.ENDGAME_GETTOTALUSERGAMESTATISTICS_FAILED, totalStatisticsResponseCode);
    }

    // if we get a 404 we want to create and initialize user statistics
    if (totalStatisticsResponseCode == 404) {

        const bodyData = [{
            "userID": parseUserID(token.sub.toString()),
            "dateRange": "1111-11-11",
        }];

        await axios.post(baseUserGameStatisticsUrl, bodyData, {
            headers: {
                Authorization: req.headers.authorization
            }
        }).then(function (response) {
            if (response.status !== 201) {
                throw new CustomError(CustomErrorEnum.ENDGAME_CREATETOTALUSERGAMESTATISTICS_FAILED, response.status);
            }
            if (response.status == 201){
                totalStatsResponseBody = response.data;
            }
        })
            .catch(function (error) {
                let responseCode = 500
                if (error.response) {
                    responseCode = error.response.status;
                }
                throw new CustomError(CustomErrorEnum.ENDGAME_CREATETOTALUSERGAMESTATISTICS_FAILED, responseCode);
            });
    }

    return totalStatsResponseBody[0].strategiesLearned;
}

/**
 *
 *
 * @param req
 */
async function patchLearnedLessons(req) {

    let token = req.auth.payload;
    let responseBody = null;

    // get active game with puzzle info
    await axios.patch(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()) + "&dateRange=1111-11-11", req.body, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.GETGAME_GETACTIVEGAME_FAILED, response.status);
        }
        responseBody = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.GETGAME_GETACTIVEGAME_FAILED, responseCode);
        });

    return responseBody;

    //return UserActiveGame object.
}

/**
 * This function takes in bodyData and queryData and updates all puzzles
 * that match the queryData with the bodyData
 * This function calls a helper function to create the inputQuery for the database function
 * @param puzzle
 * @param req
 */
async function getGameStatistics(puzzle, req) {

    let token = req.auth.payload;
    let responseBody = null;

    await axios.patch(baseUserActiveGamesUrl + "?userID=" + parseUserID(token.sub.toString()) + "&puzzle=" + puzzle, req.body, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.SAVEGAME_PATCHACTIVEGAME_FAILED, response.status);
        }
        responseBody = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.SAVEGAME_PATCHACTIVEGAME_FAILED, responseCode);
        });

    return responseBody;
}

/**
 * This function takes in the input query and deletes any UserActiveGames that match the query
 * We do not throw an error here to stay aligned with standard practice.
 * A delete request is successful even if the object did not exist.
 * @param puzzle
 * @param req
 */
async function deleteGameStatistics(puzzle, req) {

    let token = req.auth.payload;
    let totalStatsResponseBody = null;
    let dailyStatsResponseBody = null
    let activeGameResponseBody = null;

    // Get user active game to be deleted
    await axios.get(baseUserActiveGamesUrl + "?userID=" + parseUserID(token.sub.toString()) + "&puzzle=" + puzzle, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.ENDGAME_GETACTIVEGAME_FAILED, response.status);
        }
        activeGameResponseBody = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.ENDGAME_GETACTIVEGAME_FAILED, responseCode);
        });

    // Score is always a value less than 100 but can be negative if the user takes an extremely long time
    // This forumula will need to be adjusted in the future
    // Score is rounded to the nearest integer
    let score:number = Math.round(((activeGameResponseBody[0].difficulty / 1000 * 35) + (10 - activeGameResponseBody[0].numHintsUsed) +
        (30 - activeGameResponseBody[0].numWrongCellsPlayed) + (35 - activeGameResponseBody[0].currentTime)));

    // retrieve user's total game statistics
    let totalStatisticsResponseCode = 0;
    await axios.get(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()) + "&dateRange=1111-11-11", {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        totalStatisticsResponseCode = response.status;
        if (response.status == 200){
            totalStatsResponseBody = response.data;
        }
    })
        .catch(function (error) {
            if (error.response){
                totalStatisticsResponseCode = error.response.status;
            }
        });

    if (totalStatisticsResponseCode != 200 && totalStatisticsResponseCode != 404){
        throw new CustomError(CustomErrorEnum.ENDGAME_GETTOTALUSERGAMESTATISTICS_FAILED, totalStatisticsResponseCode);
    }

    // if we get a 404 we want to create and initialize user statistics
    if (totalStatisticsResponseCode == 404){

        const bodyData = [{
            "userID": parseUserID(token.sub.toString()),
            "dateRange": "1111-11-11",
            "score": score,
            "averageSolveTime": activeGameResponseBody[0].currentTime,
            "fastestSolveTime": activeGameResponseBody[0].currentTime,
            "totalSolveTime": activeGameResponseBody[0].currentTime,
            "numHintsUsed": activeGameResponseBody[0].numHintsUsed,
            "numWrongCellsPlayed": activeGameResponseBody[0].numWrongCellsPlayed,
            "numGamesPlayed": 1
        }];

        await axios.post(baseUserGameStatisticsUrl, bodyData, {
            headers: {
                Authorization: req.headers.authorization
            }
        }).then(function (response) {
            if (response.status !== 201){
                throw new CustomError(CustomErrorEnum.ENDGAME_CREATETOTALUSERGAMESTATISTICS_FAILED, response.status);
            }
        })
            .catch(function (error) {
                let responseCode = 500
                if (error.response){
                    responseCode = error.response.status;
                }
                throw new CustomError(CustomErrorEnum.ENDGAME_CREATETOTALUSERGAMESTATISTICS_FAILED, responseCode);
            });
    } else {

        const bodyData = [{
            "userID": parseUserID(token.sub.toString()),
            "dateRange": "1111-11-11",
            "score": score + totalStatsResponseBody[0].score,
            "averageSolveTime": (activeGameResponseBody[0].currentTime + totalStatsResponseBody[0].totalSolveTime) / (1 + totalStatsResponseBody[0].numGamesPlayed),
            "fastestSolveTime": (activeGameResponseBody[0].currentTime < totalStatsResponseBody[0].fastestSolveTime)
                ? activeGameResponseBody[0].currentTime : totalStatsResponseBody[0].fastestSolveTime,
            "totalSolveTime": activeGameResponseBody[0].currentTime + totalStatsResponseBody[0].totalSolveTime,
            "numHintsUsed": activeGameResponseBody[0].numHintsUsed + totalStatsResponseBody[0].numHintsUsed,
            "numWrongCellsPlayed": activeGameResponseBody[0].numWrongCellsPlayed + totalStatsResponseBody[0].numWrongCellsPlayed,
            "numGamesPlayed": 1 + totalStatsResponseBody[0].numGamesPlayed
        }];

        await axios.patch(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()) + "&dateRange=1111-11-11", bodyData, {
            headers: {
                Authorization: req.headers.authorization
            }
        }).then(function (response) {
            if (response.status !== 200){
                throw new CustomError(CustomErrorEnum.ENDGAME_UPDATETOTALUSERGAMESTATISTICS_FAILED, response.status);
            }
        })
            .catch(function (error) {
                let responseCode = 500
                if (error.response){
                    responseCode = error.response.status;
                }
                throw new CustomError(CustomErrorEnum.ENDGAME_UPDATETOTALUSERGAMESTATISTICS_FAILED, responseCode);
            });
    }


    // retrieve user's daily game statistics
    // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    let dailyStatisticsResponseCode = 0;
    let today = new Date();
    let currentDate = today.getFullYear().toString() + "-" + "0" + (today.getMonth()+1).toString().slice(-2) + "-" + "0" + today.getDate().toString().slice(-2);

    await axios.get(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()) + "&dateRange=" + currentDate, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        dailyStatisticsResponseCode = response.status;
        if (response.status == 200){
            dailyStatsResponseBody = response.data;
        }
    })
        .catch(function (error) {
            if (error.response){
                dailyStatisticsResponseCode = error.response.status;
            }
        });

    if (dailyStatisticsResponseCode != 200 && dailyStatisticsResponseCode != 404){
        throw new CustomError(CustomErrorEnum.ENDGAME_GETDAILYUSERGAMESTATISTICS_FAILED, dailyStatisticsResponseCode);
    }

    // if we get a 404 we want to create and initialize user statistics
    if (dailyStatisticsResponseCode == 404){

        const bodyData = [{
            "userID": parseUserID(token.sub.toString()),
            "dateRange": currentDate,
            "score": score,
            "averageSolveTime": activeGameResponseBody[0].currentTime,
            "fastestSolveTime": activeGameResponseBody[0].currentTime,
            "totalSolveTime": activeGameResponseBody[0].currentTime,
            "numHintsUsed": activeGameResponseBody[0].numHintsUsed,
            "numWrongCellsPlayed": activeGameResponseBody[0].numWrongCellsPlayed,
            "numGamesPlayed": 1
        }];

        await axios.post(baseUserGameStatisticsUrl, bodyData, {
            headers: {
                Authorization: req.headers.authorization
            }
        }).then(function (response) {
            if (response.status !== 201){
                throw new CustomError(CustomErrorEnum.ENDGAME_CREATEDAILYUSERGAMESTATISTICS_FAILED, response.status);
            }
        })
            .catch(function (error) {
                let responseCode = 500
                if (error.response){
                    responseCode = error.response.status;
                }
                throw new CustomError(CustomErrorEnum.ENDGAME_CREATEDAILYUSERGAMESTATISTICS_FAILED, responseCode);
            });
    } else {

        const bodyData = [{
            "userID": parseUserID(token.sub.toString()),
            "dateRange": currentDate,
            "score": score + dailyStatsResponseBody[0].score,
            "averageSolveTime": (activeGameResponseBody[0].currentTime + dailyStatsResponseBody[0].totalSolveTime) / (1 + dailyStatsResponseBody[0].numGamesPlayed),
            "fastestSolveTime": (activeGameResponseBody[0].currentTime < dailyStatsResponseBody[0].fastestSolveTime) ? activeGameResponseBody[0].currentTime : dailyStatsResponseBody[0].fastestSolveTime,
            "totalSolveTime": activeGameResponseBody[0].currentTime + dailyStatsResponseBody[0].totalSolveTime,
            "numHintsUsed": activeGameResponseBody[0].numHintsUsed + dailyStatsResponseBody[0].numHintsUsed,
            "numWrongCellsPlayed": activeGameResponseBody[0].numWrongCellsPlayed + dailyStatsResponseBody[0].numWrongCellsPlayed,
            "numGamesPlayed": 1 + dailyStatsResponseBody[0].numGamesPlayed
        }];

        await axios.patch(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()) + "&dateRange=" + currentDate, bodyData, {
            headers: {
                Authorization: req.headers.authorization
            }
        }).then(function (response) {
            if (response.status !== 200){
                throw new CustomError(CustomErrorEnum.ENDGAME_UPDATEDAILYUSERGAMESTATISTICS_FAILED, response.status);
            }
        })
            .catch(function (error) {
                let responseCode = 500
                if (error.response){
                    responseCode = error.response.status;
                }
                throw new CustomError(CustomErrorEnum.ENDGAME_UPDATEDAILYUSERGAMESTATISTICS_FAILED, responseCode);
            });
    }


    // delete the specified user's game statistics
    await axios.delete(baseUserGameStatisticsUrl + "?userID=" + parseUserID(token.sub.toString()), {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.ENDGAME_DELETEACTIVEGAME_FAILED, response.status);
        }
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.ENDGAME_DELETEACTIVEGAME_FAILED, responseCode);
        });

    return {
        "score": score,
        "solveTime": activeGameResponseBody[0].currentTime,
        "numHintsUsed": activeGameResponseBody[0].numHintsUsed,
        "numWrongCellsPlayed": activeGameResponseBody[0].numWrongCellsPlayed,
    };
}

function parseUserID(userID){
    return userID.replace(new RegExp("[|]", "g"), "-")
}

export = { patchLearnedLessons: patchLearnedLessons, getLearnedLessons: getLearnedLessons, getGameStatistics: getGameStatistics, deleteGameStatistics: deleteGameStatistics };

