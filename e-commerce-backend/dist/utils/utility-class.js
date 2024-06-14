"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.default = ErrorHandler;
