import CustomError from "./custom-error.js";
const errorHandler = (options) => {
    return (err, req, res, next) => {   
        if (err instanceof CustomError) {
            console.error(err.stack);
            return res.status(err.statusCode).json({ message: err.message });
        }      
        console.error(err.stack);
        res.status(500).json({ message: err.message || "Something went wrong" });
    }
}
export { CustomError };
export default errorHandler;