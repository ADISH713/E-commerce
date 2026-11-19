import MESSAGES from "../constants/messages.js";

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || MESSAGES.COMMON.INTERNAL_ERROR;

    if (statusCode >= 500) {
        console.error(err);
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = err.keyPattern?.email
            ? MESSAGES.AUTH.EMAIL_EXISTS
            : MESSAGES.PRODUCT.DUPLICATE;
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = MESSAGES.COMMON.INVALID_ID;
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};

export default errorMiddleware;