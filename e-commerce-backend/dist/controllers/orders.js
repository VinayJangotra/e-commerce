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
exports.newOrder = void 0;
const error_1 = require("../middlewares/error");
const order_1 = require("../models/order");
const features_1 = require("../utils/features");
exports.newOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
    if (!shippingInfo ||
        !orderItems ||
        !user ||
        subtotal === undefined ||
        tax === undefined ||
        shippingCharges === undefined ||
        discount === undefined ||
        total === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }
    yield order_1.Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total
    });
    yield (0, features_1.reduceStock)(orderItems);
    yield (0, features_1.invalidatesCache)({ product: true, order: true, admin: true });
    return res.status(201).json({
        success: true,
        message: 'order placed successfully',
    });
}));
