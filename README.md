# An express js error handler

This is an express js error handler that can be used to handle errors in your express js application.

## Installation

```bash
npm install @sunaram/error-handler
```

## Usage

Import errorHandler
```js
import errorHandler from "@sunaram/error-handler";
```

Add errorHandler to your express app after your routes
```js
const handlerOptions = {
    isDevelopment: process.env.NODE_ENV === 'development',
}
app.use(errorHandler(handlerOptions));
```

Pass a logger function
```js
const handlerOptions = {
    isDevelopment: process.env.NODE_ENV === 'development',
    log: (err) => {
        console.error(err);
        console.error(err.stack);
    }
}
app.use(errorHandler(handlerOptions));
```

Customize handling of specific errors
```js
const errorTypes = {
    SequelizeDatabaseError: {
        status: 500,
        message: "Error Encountered",
        log: (err) => {
            console.error(err);
            console.error(err.stack);
        }
    }
}

const handlerOptions = {
    isDevelopment: process.env.NODE_ENV === 'development',
    errorTypes,
}
app.use(errorHandler(handlerOptions));
```

You can also make use of CustomError to create custom errors that can be handled by this error handler

```js
import { CustomError } from "@sunaram/error-handler";

## validate middleware

return (req, res, next) => {
    ...
    const error = [];
    ...
    const validationError = new CustomError("ValidationError", "Validation Error", 400, error);
    next(validationError)
}
```

### error handler options

**isDevelopment**: boolean (default: false)  
**errorTypes**: object (default: {})  
**log**: function | boolean | undefined (default: undefined)  


## License

MIT

## Author

Sunaram Patir