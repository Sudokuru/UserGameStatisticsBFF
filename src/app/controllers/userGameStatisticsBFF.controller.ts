/**
 * This is the controller file for the puzzle endpoint
 * This file is called by the router file and calls the service file
 * There are four main functions {@link patchLearnedLessons}, {@link getLearnedLessons},
 * {@link getGameStatistics}, and {@link deleteGameStatistics}
 * The main purpose of the controller is to make sure that only validated and sanitized data
 * moves on to the service function
 * @module PuzzleController
 */

import {CustomError, CustomErrorEnum} from "../models/error.model";

const userGameStatisticsBFFService = require('../services/userGameStatisticsBFF.service');


/**
 * Returns 200 if createGameService is successful
 * Otherwise catches error and sends to our errorHandler
 * Takes parameters and sends it to createGameService
 * @param req This is the request object
 * @param res This is the response object
 * @param next This takes us to the errorHandler if request fails
 */
async function getLearnedLessons(req, res, next) {
    try {
        res.json(await userGameStatisticsBFFService.getLearnedLessons(req));
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
async function patchLearnedLessons(req, res, next) {

    try {
        if (!('strategiesLearned' in req.body)){
            throw new CustomError(CustomErrorEnum.SAVEGAME_INVALIDPUZZLE, 400);
        }
        res.json(await userGameStatisticsBFFService.patchLearnedLessons(req));
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
async function getGameStatistics(req, res, next) {
    try {
        res.json(await userGameStatisticsBFFService.getGameStatistics(req.query['puzzle'], req));
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
async function deleteGameStatistics(req, res, next) {
    try {
        res.json(await userGameStatisticsBFFService.deleteGameStatistics(req));
    } catch(err) {
        next(err);
    }
}

export = {patchLearnedLessons: patchLearnedLessons, getLearnedLessons: getLearnedLessons, getGameStatistics: getGameStatistics, deleteGameStatistics: deleteGameStatistics}