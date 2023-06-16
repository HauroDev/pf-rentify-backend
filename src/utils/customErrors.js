class CustomError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
    this.message = this.constructor.message
    Error.captureStackTrace(this, this.constructor)
  }
}
// Error.captureStackTrace(this, this.constructor);
// se establece la pila de llamadas específica del error.
// se puede eliminar

const createCustomError = (status, message) => {
  return new CustomError(status, message)
}

module.exports = {
  createCustomError,
  CustomError
}

// * se utiliza así:
// const error = createError(404, 'Not Found');
// throw error;
