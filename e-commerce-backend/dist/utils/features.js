"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => {
    mongoose_1.default.connect("mongodb://localhost:27017", {
        dbName: "E-commerce_24"
    })
        .then(() => {
        console.log("Database connected successfully");
    })
        .catch((error) => {
        console.log("Error connecting to database", error);
    });
};
exports.connectDB = connectDB;
