import CustomError from "./custom-error.js";
import ErrorHandler from "./error-handler.js";
import type { HandlerOptions } from "./types/handler.js";
const errorHandler = (options: HandlerOptions) => {
    const errorHandler = new ErrorHandler(options || {});
    return errorHandler.handleError.bind(errorHandler);
}
export { CustomError };
export default errorHandler;