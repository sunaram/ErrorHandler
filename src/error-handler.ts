import CustomError from "./custom-error.js";
import type { HandlerOptions } from "./types/handler.js";
import type { Request, Response, NextFunction } from "express";
class ErrorHandler {
    errorTypes: any;
    isDevelopment: boolean;
    log: Function | boolean | undefined;
    constructor(options: HandlerOptions) {
        this.errorTypes = options.errorTypes || {};
        this.isDevelopment = options.isDevelopment || false;
        this.log = options.log;
    }
    handleLog(err: Error) {
        if((this.isDevelopment && this.log === undefined) || this.log) {
            if(typeof this.log === "function") {
                this.log(err);
            } else {
                this.printError(err);
            }
        }
        
    }
    printError(err: Error) {
        console.error(err);
        console.error(err.stack);
    }
    handleError(err: Error, _req: Request, res: Response, _next: NextFunction) {
        // check if the error belongs to a specific error type
        if(this.errorTypes && this.errorTypes[err.name]) {
            const statusCode = this.errorTypes[err.name].statusCode || 500;
            const message = this.errorTypes[err.name].message || (err.message || "Something went wrong"); // default message is "Something went wrong";
            if(this.errorTypes[err.name].log !== undefined) {
                if(typeof this.errorTypes[err.name].log === "function") {
                    this.errorTypes[err.name].log(err);
                } else {
                    this.printError(err);
                }
            } else {
                // log error if development environment 
                this.handleLog(err);
            }
            return res.status(statusCode).json({ message });
        } 

        // log error if development environment 
        this.handleLog(err);
         
        // if error is instance of CustomError
        if (err instanceof CustomError) {
            const returnObj = {
                message: err.message,                
            } as any;
            if(this.isDevelopment) {
                returnObj.error = err.error;
            }
            return res.status(err.statusCode).json(returnObj);
        }
        // handle all other errors
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
}

export default ErrorHandler;