import CustomError from "./custom-error.js";
const errorHandler = (options) => {
    return (err, req, res, next) => { 
        if(options && options.isDevelopment && err.stack) {
            console.error(err.stack);
        }   
        if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
}
export { CustomError };
export default errorHandler;