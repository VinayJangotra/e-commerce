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
exports.deleteOrder = exports.processOrder = exports.getOrder = exports.allOrders = exports.myOrders = exports.newOrder = void 0;
const error_1 = require("../middlewares/error");
const order_1 = require("../models/order");
const features_1 = require("../utils/features");
const node_cache_1 = __importDefault(require("node-cache"));
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const myCache = new node_cache_1.default();
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
    const order = yield order_1.Order.create({
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
    yield (0, features_1.invalidatesCache)({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((i) => String(i.productId)),
    });
    return res.status(201).json({
        success: true,
        message: 'order placed successfully',
    });
}));
// My Orders
exports.myOrders = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user } = req.query;
    let orders = [];
    if (myCache.has(`my-orders-${user}`))
        orders = JSON.parse(myCache.get(`my-orders-${user}`));
    else {
        orders = yield order_1.Order.find({ user });
        myCache.set(`my-orders-${user}`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders
    });
}));
// All Orders
exports.allOrders = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `all-orders`;
    let orders = [];
    if (myCache.has(key))
        orders = JSON.parse(myCache.get(key));
    else {
        orders = yield order_1.Order.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
}));
// Get Single Order
exports.getOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;
    if (myCache.has(key))
        order = JSON.parse(myCache.get(key));
    else {
        order = yield order_1.Order.findById(id).populate("user", "name");
        if (!order)
            return next(new utility_class_1.default("Order Not Found", 404));
        myCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
}));
// Process Order
exports.processOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_1.Order.findById(id);
    if (!order)
        return next(new utility_class_1.default("Order Not Found", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    yield order.save();
    yield (0, features_1.invalidatesCache)({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(200).json({
        success: true,
        message: "Order Processed Successfully",
    });
}));
exports.deleteOrder = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_1.Order.findById(id);
    if (!order)
        return next(new utility_class_1.default("Order Not Found", 404));
    yield order.deleteOne();
    yield (0, features_1.invalidatesCache)({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully",
    });
}));
