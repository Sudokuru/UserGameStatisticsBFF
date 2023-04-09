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
    LEARNEDLESSONS_LESSONSNOTPROVIDED = "Lessons learned array has not been provided",
    LEARNEDLESSONS_GETLESSONS_FAILED = "Retrieval of user's learned lessons has failed",
    LEARNEDLESSONS_CREATELESSONS_FAILED = "Creation of user's learned lessons has failed",
    LEARNEDLESSONS_UPDATELESSONS_FAILED = "Updating user's learned lessons has failed",
    GAMESTATISTICS_GETGAMESTATISTICS_FAILED = "Retrieval of user's statistics has failed",
    GAMESTATISTICS_DELETEGAMESTATISTICS_FAILED = "Deletion of user's statistics has failed",
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