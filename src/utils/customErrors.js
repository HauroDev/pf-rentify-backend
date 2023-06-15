class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Error.captureStackTrace(this, this.constructor);
//se establece la pila de llamadas específica del error.
// se puede eliminar

const createError = (statusCode, message) => {
    return new CustomError(statusCode, message);
};

module.exports = {
    createError,
    CustomError
};

// * se utiliza así:
// const error = createError(404, 'Not Found');
// throw error;