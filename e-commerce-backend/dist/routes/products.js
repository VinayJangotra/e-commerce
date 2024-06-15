"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../middlewares/multer");
const product_1 = require("../controllers/product");
const app = express_1.default.Router();
// Creation of the new product
app.post("/new", multer_1.singleUpload, product_1.newProduct);
exports.default = app;
