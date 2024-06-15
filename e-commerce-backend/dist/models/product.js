"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    photo: {
        type: String,
        required: [true, "Please enter your photo"],
    },
    price: {
        type: Number,
        required: [true, "Please enter your Price"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter the stock"],
    },
    category: {
        type: String,
        required: [true, "Please enter the category"],
        trim: true
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model("Product", schema);
