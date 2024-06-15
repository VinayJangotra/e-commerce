"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../middlewares/multer");
const product_1 = require("../controllers/product");
const app = express_1.default.Router();
// Creation of the new product
app.post("/new", auth_1.adminOnly, multer_1.singleUpload, product_1.newProduct);
// Get the latest product
app.get("/latest", product_1.getLatestProduct);
//g Get all the categories
app.get("/category", product_1.getCategories);
// Get all the prfoducts from the list
app.get("/admin-products", auth_1.adminOnly, product_1.getAdminProduct);
// Get single product and updation product
app.route("/:id").get(product_1.getSingleProduct).put(multer_1.singleUpload, product_1.updateProduct).delete(multer_1.singleUpload, product_1.deleteProduct);
exports.default = app;
