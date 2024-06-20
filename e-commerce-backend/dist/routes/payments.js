"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const payment_1 = require("../controllers/payment");
const app = express_1.default.Router();
// Creation of the new product
app.post("/coupon/new", auth_1.adminOnly, payment_1.newCoupon);
// Route fo the checking the existence of the coupon and apply the discount
app.get("/discount", payment_1.applyDiscount);
// Get all the coupons
app.get("/discount/all", auth_1.adminOnly, payment_1.allCoupons);
// Dleete all the coupons
app.delete("/coupon/:id", auth_1.adminOnly, payment_1.deleteCoupon);
exports.default = app;
