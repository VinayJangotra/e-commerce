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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceStock = exports.invalidatesCache = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const node_cache_1 = __importDefault(require("node-cache"));
const product_1 = require("../models/product");
const myCache = new node_cache_1.default();
const connectDB = (uri) => {
    mongoose_1.default.connect(uri, {
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
// This function is used to delete the cache in the memory
const invalidatesCache = (_a) => __awaiter(void 0, [_a], void 0, function* ({ product, order, admin }) {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products"
        ];
        const products = yield product_1.Product.find({}).select("_id");
        products.forEach((key) => {
            productKeys.push(`product-${key._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
        myCache.del("latest-orders");
    }
    if (admin) {
        myCache.del("latest-admins");
    }
});
exports.invalidatesCache = invalidatesCache;
const reduceStock = (orderItems) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = yield product_1.Product.findById(order.productId);
        if (!product)
            throw new Error('Product Not Found');
        product.stock = product.stock - order.quantity;
        yield product.save();
    }
});
exports.reduceStock = reduceStock;
