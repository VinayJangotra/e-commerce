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
exports.newCoupon = void 0;
const error_1 = require("../middlewares/error");
const Coupon_1 = require("../models/Coupon");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
exports.newCoupon = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new utility_class_1.default("Please enter both coupon and amount", 400));
    yield Coupon_1.Coupon.create({
        code: coupon, amount
    });
    return res.status(201).json({
        success: true,
        message: "Coupon created successfully"
    });
}));
