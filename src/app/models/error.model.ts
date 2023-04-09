// Code from here: https://dev.to/arealesramirez/how-to-use-error-handler-middleware-with-express-js-and-typescript-431n#:~:text=How%20to%20Write%20a%20Custom%20Error%20Handler%20in,file.%20...%204%204.%20Test%20Custom%20Handler%20
// https://dev.to/qbentil/how-to-write-custom-error-handler-middleware-in-expressjs-using-javascript-29j1

/**
 * This is our model for the custom error handler
 * We have messages that are thrown in the console
 * The default messages are thrown to the user as well as the unknown message
 * which catches any errors that we have not handled
 * If we have any unknown errors we want to handle those with a custom error message
 * @module ErrorModel
 */

export enum CustomErrorEnum {
    INSUFFICIENT_SCOPE_ERROR = "The user does not have the required scopes",
    NO_TOKEN_PROVIDED = "No Token Provided",
    INVALID_TOKEN = "Invalid Token",
    INVALID_PATH = "The path provided is invalid",
    STARTGAME_INVALIDDIFFICULTY = "Invalid difficulty provided",
    STARTGAME_DELETEOLDACTIVEGAMES_FAILED = "The deletion of old active games failed",
    STARTGAME_GETPUZZLE_FAILED = "The retrieval of a new puzzle failed",
    STARTGAME_CREATEACTIVEGAME_FAILED = "The creation of a new active game failed",
    GETGAME_GETACTIVEGAME_FAILED = "The retrieval of an existing active game failed",
    SAVEGAME_PATCHACTIVEGAME_FAILED = "The patch of an existing active game failed",
    SAVEGAME_INVALIDPUZZLE = "Invalid puzzle provided",
    ENDGAME_DELETEACTIVEGAME_FAILED = "The deletion of active game failed",
    ENDGAME_INVALIDPUZZLE = "Invalid puzzle provided",
    ENDGAME_GETACTIVEGAME_FAILED = "Retrieval of active game for end game failed",
    ENDGAME_GETTOTALUSERGAMESTATISTICS_FAILED = "Error when retrieving total user game statistics",
    ENDGAME_CREATETOTALUSERGAMESTATISTICS_FAILED = "Error with post request for total user game statistics",
    ENDGAME_UPDATETOTALUSERGAMESTATISTICS_FAILED = "Error with patch request for total user game statistics",
    ENDGAME_GETDAILYUSERGAMESTATISTICS_FAILED = "Error when retrieving daily user game statistics",
    ENDGAME_CREATEDAILYUSERGAMESTATISTICS_FAILED = "Error with post request for daily user game statistics",
    ENDGAME_UPDATEDAILYUSERGAMESTATISTICS_FAILED = "Error with patch request for daily user game statistics",
    GETDRILL_FAILED = "The retrieval of a new drill failed",
    GETDRILL_INVALIDDRILLSTRATEGIES = "Invalid drillStrategies provided",
    INVALID_SYNTAX = "The request has invalid syntax",
    PUZZLE_NOT_FOUND = "Puzzle matching search criteria was not found",
    DEFAULT_400_ERROR = "Invalid Request",
    DEFAULT_401_ERROR = "Invalid Permission",
    DEFAULT_404_ERROR = "Resource Not Found",
    DEFAULT_500_ERROR = "Service Unavailable",
    UNKNOWN_ERROR = "Unknown Error"
}

export class CustomError {

    Error_Message!: CustomErrorEnum;
    Status!: number;

    constructor(message: CustomErrorEnum, status: number){
        this.Error_Message = message;
        this.Status = status;
    }
}