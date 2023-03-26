/**
 * This is the puzzle service file
 * This file takes input from the controller and directs it to the db.service file
 * The five functions are {@link getGameService}, {@link createGameService},
 * {@link saveGameService}, {@link endGameService}, and {@link filterInputQuery}
 * The main purpose of this service file is to perform the 'business' logic
 * Any errors will be caught by our try/catch block in our controller
 * @module
 */

import {CustomError, CustomErrorEnum} from "../models/error.model";

require('dotenv').config();
const axios = require('axios').default;
const basePuzzleUrl = process.env.PUZZLE_URL + '/api/v1/puzzles';
const baseUserActiveGamesUrl = process.env.USER_ACTIVE_GAMES_URL + '/api/v1/user/activeGames';


/**
 * This function takes in the input query and throws and error if no puzzles
 * are found to match the query
 * This function calls a helper function to create the inputQuery for the dataBase function
 * @param closestDifficulty is an integer storing requested closestDifficulty
 * @param req
 */
async function createGameService(closestDifficulty:number, req:any) {

    let token = req.auth.payload;
    let puzzleGetResponse = null;
    let responseBody = null;

    // delete all existing user active games
    await axios.delete(baseUserActiveGamesUrl + "?userID=" + parseUserID(token.sub.toString()), {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.STARTGAME_DELETEOLDACTIVEGAMES_FAILED, response.status);
        }
    })
    .catch(function (error) {
        let responseCode = 500
        if (error.response){
            responseCode = error.response.status;
        }
        throw new CustomError(CustomErrorEnum.STARTGAME_DELETEOLDACTIVEGAMES_FAILED, responseCode);
    });

    // get puzzle from puzzle database
    await axios.get(basePuzzleUrl + "?closestDifficulty=" + closestDifficulty + "&count=1", {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.STARTGAME_GETPUZZLE_FAILED, response.status);
        }
        puzzleGetResponse = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.STARTGAME_GETPUZZLE_FAILED, responseCode);
        });

    //todo verify game has not been played before by player

    // create active game with puzzle info

    const bodyData = [{
        "userID": parseUserID(token.sub.toString()),
        "puzzle": puzzleGetResponse[0].puzzle,
        "puzzleSolution": puzzleGetResponse[0].puzzleSolution,
        "difficulty": puzzleGetResponse[0].difficulty
    }];

    await axios.post(baseUserActiveGamesUrl, bodyData, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 201){
            throw new CustomError(CustomErrorEnum.STARTGAME_CREATEACTIVEGAME_FAILED, response.status);
        }
        responseBody = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.STARTGAME_CREATEACTIVEGAME_FAILED, responseCode);
        });

    return responseBody;

    //return new UserActiveGame object.
}

/**
 *
 *
 * @param req
 */
async function getGameService(req) {

    let token = req.auth.payload;
    let responseBody = null;

    // get active game with puzzle info
    await axios.get(baseUserActiveGamesUrl + "?userID=" + parseUserID(token.sub.toString()), {
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
async function saveGameService(puzzle, req) {

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
async function endGameService(puzzle, req) {

    let token = req.auth.payload;
    let responseBody = null;

    // delete all existing user active games
    await axios.delete(baseUserActiveGamesUrl + "?userID=" + parseUserID(token.sub.toString()) + "&puzzle=" + puzzle, {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.ENDGAME_DELETEACTIVEGAME_FAILED, response.status);
        }
        responseBody = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.ENDGAME_DELETEACTIVEGAME_FAILED, responseCode);
        });

    return responseBody;
}

/**
 *
 *
 * @param drillStrategy
 * @param req
 */
async function getDrillService(drillStrategy, req) {

    let responseBody = null;

    // get drill game

    await axios.get(basePuzzleUrl + "?drillStrategies[]=" + drillStrategy + "&count=1", {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then(function (response) {
        if (response.status !== 200){
            throw new CustomError(CustomErrorEnum.GETDRILL_FAILED, response.status);
        }
        responseBody = response.data;
    })
        .catch(function (error) {
            let responseCode = 500
            if (error.response){
                responseCode = error.response.status;
            }
            throw new CustomError(CustomErrorEnum.GETDRILL_FAILED, responseCode);
        });

    return responseBody;

    //return Puzzle object.
}

function parseUserID(userID){
    return userID.replace(new RegExp("[|]", "g"), "-")
}

export = { getGame: getGameService, createGameService: createGameService, updateGame: saveGameService, endGame: endGameService, getDrill: getDrillService };

