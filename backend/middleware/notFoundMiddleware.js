import MESSAGES from "../constants/messages.js";

const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: MESSAGES.COMMON.ROUTE_NOT_FOUND(req.originalUrl),
        data: null
    });
};

export default notFoundMiddleware;