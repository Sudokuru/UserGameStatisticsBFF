/**
 * Below are the routes for the entire app
 * All requests with the valid base path will enter from app.ts to here
 * The requests will then go to the validators, the validation error handler, and then the controller
 * Each endpoint will have a post, get, patch, and delete options
 * @module Routes
 */

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const express = require("express");
const routes = express.Router();
require('dotenv').config();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://` + process.env.AUTH0_BASE_URL + '/',
});

const puzzleController = require('../controllers/userActiveGamesBFF.controller');

routes.get("/newGame/", checkJwt, puzzleController.createGame); //later change this to POST activeGames
//routes.get("/activeGames/", checkJwt, puzzleController.resumeGame);
routes.patch("/activeGames/", checkJwt, puzzleController.updateGame);
routes.delete("/activeGames/", checkJwt, puzzleController.endGame);

// later incorporate getDrill as part of activeGames POST, GET, PATCH, DELETE as a different 'gamemode'
//routes.get("/drillGame/", checkJwt, puzzleController.createDrillGame);

export = routes;

