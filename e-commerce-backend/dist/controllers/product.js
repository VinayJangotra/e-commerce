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
exports.getAllProduct = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAdminProduct = exports.getCategories = exports.getlatestProducts = exports.newProduct = void 0;
const fs_1 = require("fs");
const error_1 = require("../middlewares/error");
const product_1 = require("../models/product");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
// import { myCache } from "../App";
const node_cache_1 = __importDefault(require("node-cache"));
const features_1 = require("../utils/features");
const myCache = new node_cache_1.default();
// import  {faker} from "@faker-js/faker"
exports.newProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo) {
        return res.status(411).json({
            message: "Please upload a photo",
        });
    }
    if (!name || !category || !price || !stock) {
        // remove the photo if it already exist
        (0, fs_1.rm)(photo.path, () => {
            console.log("Photo removed");
        });
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
    yield (0, features_1.invalidatesCache)({ product: true, admin: true });
    return res.status(201).json({
        status: "success",
        message: "Product created successfully",
    });
}));
// Get the latest product
// Revalidate on new Update ordelete product saand new order
exports.getlatestProducts = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let products;
    if (myCache.has("latest-products"))
        products = JSON.parse(myCache.get("latest-products"));
    else {
        products = yield product_1.Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
}));
// Get all the categories
exports.getCategories = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // on the basis of the category field the  product is provided the categories
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = yield product_1.Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        status: "success",
        categories,
    });
}));
///Get all the products a as a admin
exports.getAdminProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // It gives all the products that are available in the list
    let product;
    if (myCache.has("all-products")) {
        product = JSON.parse(myCache.get("all-products"));
    }
    else {
        product = yield product_1.Product.find({});
        myCache.set("all-products", JSON.stringify(product));
    }
    return res.status(200).json({
        status: "success",
        product,
    });
}));
// get single product
exports.getSingleProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let product;
    if (myCache.has(`product-${req.params.id}`)) {
        product = JSON.parse(myCache.get(`product-${req.params.id}`));
    }
    else {
        product = yield product_1.Product.findById(req.params.id);
        if (!product)
            return next(new utility_class_1.default("Page  Not Found", 404));
        myCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        status: "success",
        product,
    });
}));
// update the product
exports.updateProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = yield product_1.Product.findById(req.params.id);
    if (!product)
        return next(new utility_class_1.default("Product Not Found", 404));
    if (photo) {
        (0, fs_1.rm)(product.photo, () => {
            console.log("Old Photo Deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    yield product.save();
    yield (0, features_1.invalidatesCache)({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(201).json({
        status: "success",
        product,
        message: "Product updated, successfully",
    });
}));
// Delete product
exports.deleteProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.Product.findById(req.params.id);
    if (!product)
        return next(new utility_class_1.default("Page  Not Found", 404));
    (0, fs_1.rm)(product.photo, () => {
        console.log("Photo removed");
    });
    yield product.deleteOne();
    yield (0, features_1.invalidatesCache)({ product: true, admin: true });
    return res.status(200).json({
        status: "success",
        message: "Product Deleted successfully",
    });
}));
// Search Functionality
exports.getAllProduct = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (category)
        baseQuery.category = category;
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    // Pagination inn which we skip the products in order to show to the next page
    const products = yield product_1.Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const count = yield product_1.Product.find(baseQuery);
    const totalPage = Math.ceil(count.length / limit);
    return res.status(200).json({
        status: "success",
        products,
        totalPage,
    });
}));
// This is used to generate the random products in the database using  the faker,js
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\ff78cc8d-af98-4abb-acab-08ee320d535c.jpeg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ succecss: true });
// };
// generateRandomProducts(40);
//delete the Products from the database
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
// deleteRandomsProducts(40);
