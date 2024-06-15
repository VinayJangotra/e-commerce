"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newProduct = void 0;
const error_1 = require("../middlewares/error");
const product_1 = require("../models/product");
exports.newProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!name || !category || !price || !stock) {
        return res.status(411).json({
            message: "All fields are required",
        });
    }
    //logic to create a new product
    yield product_1.Product.create({
        name,
        category,
        price,
        stock,
        photo: photo === null || photo === void 0 ? void 0 : photo.path,
    });
    return res.status(201).json({
        status: "success",
        message: "Product created successfully",
    });
}));
