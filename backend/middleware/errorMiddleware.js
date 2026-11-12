
const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = "Product already exists in this category";
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid product ID";
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};

export default errorMiddleware;
