class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
    error: any;
    constructor(name: string, message: string, statusCode?: number, error?: any) {
        super(message); // Call the parent Error constructor with the message
        //this.name = this.constructor.name; // Set the name of the error to the class name
        this.name = name;
        this.statusCode = statusCode || 500; // Add a custom property like status code
        this.isOperational = true; // Indicate if it's an expected operational error
        this.error = error;

        // Capture the stack trace, excluding the CustomError constructor call, if available        
        Error.captureStackTrace!(this, this.constructor);        
    }
}

export default CustomError;