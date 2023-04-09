/**
 * This is the controller file for the puzzle endpoint
 * This file is called by the router file and calls the service file
 * There are four main functions {@link getGame}, {@link createGame},
 * {@link updateGame}, and {@link endGame}
 * The main purpose of the controller is to make sure that only validated and sanitized data
 * moves on to the service function
 * @module PuzzleController
 */

import {CustomError, CustomErrorEnum} from "../models/error.model";

const puzzleService = require('../services/userGameStatisticsBFF.service');


/**
 * Returns 200 if createGameService is successful
 * Otherwise catches error and sends to our errorHandler
 * Takes parameters and sends it to createGameService
 * @param req This is the request object
 * @param res This is the response object
 * @param next This takes us to the errorHandler if request fails
 */
async function createGame(req, res, next) {

    try {
        // if difficulty is not provided in parameters we throw error
        if (!('closestDifficulty' in req.query)){
            throw new CustomError(CustomErrorEnum.STARTGAME_INVALIDDIFFICULTY, 400);
        }

        res.json(await puzzleService.createGameService(Number(req.query['closestDifficulty']), req));
    } catch(err) {
        next(err);
    }
}

/**
 * Returns 201 if getGameService is successful
 * Otherwise catches error and sends to our errorHandler
 * Takes sanitized input and sends it to getGameService
 * @param req This is the request object
 * @param res This is the response object
 * @param next This takes us to the errorHandler if request fails
 */
async function getGame(req, res, next) {

    try {
        res.json(await puzzleService.patchLearnedLessons(req));
    } catch(err) {
        next(err);
    }
}

/**
 * Returns 200 if updateGameService is successful
 * Otherwise catches error and sends to our errorHandler
 * Takes sanitized input and sends it to updateGameService
 * @param req This is the request object
 * @param res This is the response object
 * @param next This takes us to the errorHandler if request fails
 */
async function updateGame(req, res, next) {

    try {
        if (!('puzzle' in req.query)){
            throw new CustomError(CustomErrorEnum.SAVEGAME_INVALIDPUZZLE, 400);
        }

        res.json(await puzzleService.getGameStatistics(req.query['puzzle'], req));
    } catch(err) {
        next(err);
    }
}

/**
 * Returns 200 if endGameService is successful
 * Otherwise catches error and sends to our errorHandler
 * Takes sanitized input and sends it to endGameService
 * @param req This is the request object
 * @param res This is the response object
 * @param next This takes us to the errorHandler if request fails
 */
async function endGame(req, res, next) {

    try {
        if (!('puzzle' in req.query)){
            throw new CustomError(CustomErrorEnum.ENDGAME_INVALIDPUZZLE, 400);
        }

        res.json(await puzzleService.deleteGameStatistics(req.query['puzzle'], req));
    } catch(err) {
        next(err);
    }
}

/**
 * Returns 200 if getDrillService is successful
 * Otherwise catches error and sends to our errorHandler
 * Takes sanitized input and sends it to getGameService
 * @param req This is the request object
 * @param res This is the response object
 * @param next This takes us to the errorHandler if request fails
 */
async function getDrill(req, res, next) {

    try {
        console.log(req.query);
        if (!('drillStrategies' in req.query)){
            throw new CustomError(CustomErrorEnum.GETDRILL_INVALIDDRILLSTRATEGIES, 400);
        }

        res.json(await puzzleService.getDrill(req.query['drillStrategies'], req));
    } catch(err) {
        next(err);
    }
}

export = {patchLearnedLessons: getGame, getLearnedLessons: createGame, getGameStatistics: updateGame, deleteGameStatistics: endGame, getDrill: getDrill }