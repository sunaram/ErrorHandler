import CustomError from "./custom-error.js";
const errorHandler = (options) => {
    return (err, req, res, next) => { 
        // if development environment, by default log error. also log if asked
        if(options && ((options.isDevelopment && err.stack && options.log === undefined) || options.log === true)) {
            console.error(err.stack);
        } 
        // if errorTypes is passed for specific errors, handle them accordingly
        if(options && options.errorTypes && options.errorTypes[err.name]) {
            const statusCode = options.errorTypes[err.name].statusCode || 500;
            const message = options.errorTypes[err.name].message || (err.message || "Something went wrong"); // default message is "Something went wrong";
            const logFunction = options.errorTypes[err.name].log || false;
            if(logFunction) {
                logFunction(err);
            }
            return res.status(statusCode).json({ message });
        }  
        // if error is instance of CustomError
        if (err instanceof CustomError) {
            const returnObj = {
                message: err.message,                
            }
            if(options?.isDevelopment) {
                returnObj.error = err.error;
            }
            return res.status(err.statusCode).json(returnObj);
        }
        // handle all other errors
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
}
export { CustomError };
export default errorHandler;