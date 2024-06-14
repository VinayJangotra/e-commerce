"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = exports.errorMiddlewware = void 0;
const errorMiddlewware = (err, req, res, next) => {
    err.message || (err.message = "Invalid Server Error");
    err.statusCode || (err.statusCode = 500);
    res.status(err.statusCode).json({
        status: "fail",
        message: err.message,
    });
};
exports.errorMiddlewware = errorMiddlewware;
const TryCatch = (func) => {
    return (req, res, next) => {
        return Promise.resolve(func(req, res, next)).catch(next);
    };
};
exports.TryCatch = TryCatch;
