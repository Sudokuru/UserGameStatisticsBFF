/**
 * This is the puzzle service file
 * This file takes input from the controller and directs it to the db.service file
 * The five functions are {@link puzzleCreateService}, {@link createGameService},
 * {@link puzzleUpdateService}, {@link puzzleRemoveService}, and {@link filterInputQuery}
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
 * @param difficulty is an integer storing requested difficulty
 * @param req
 */
async function createGameService(difficulty:number, req:any) {

    let token = req.auth.payload;
    let puzzleGetResponse = null;
    let responseBody = null;

    // delete all existing user active games
    await axios.delete(baseUserActiveGamesUrl + "?userID=" + token.sub.toString(), {
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
    await axios.get(basePuzzleUrl + "?difficulty=" + difficulty + "&count=1", {
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
        "userID": token.sub.toString(),
        "puzzle": puzzleGetResponse[0].puzzle,
        "puzzleSolution": puzzleGetResponse[0].puzzleSolution
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
 * This function takes the JSON puzzles and sends them to the upload function
 * There is no need for any additional logic here
 * @param puzzles This is an array of JSON puzzles
 */
async function puzzleCreateService(puzzles) {

}

/**
 * This function takes in bodyData and queryData and updates all puzzles
 * that match the queryData with the bodyData
 * This function calls a helper function to create the inputQuery for the database function
 * @param bodyData this stores a JSON object with values to be updated
 * @param queryData this stores a JSON object with values used to retrieve puzzles to be updated
 */
async function puzzleUpdateService(bodyData, queryData) {
}

/**
 * This function takes in the input query and deletes any puzzles that match the query
 * We do not throw an error here to stay aligned with standard practice.
 * A delete request is successful even if the object did not exist.
 * @param puzzles this stores a JSON object that stores the query
 */
async function puzzleRemoveService(puzzles) {
}

export = { createPuzzle: puzzleCreateService, createGameService: createGameService, updatePuzzle: puzzleUpdateService, removePuzzle: puzzleRemoveService };

