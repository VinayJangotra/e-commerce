"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_1 = require("../controllers/orders");
const auth_1 = require("../middlewares/auth");
const app = express_1.default.Router();
// route /api/v1/order/new
app.post("/new", orders_1.newOrder);
// User  Orders
app.get("/my", orders_1.myOrders);
// all orders
app.get("/all", auth_1.adminOnly, orders_1.allOrders);
// Get Single order
app.route('/:id').get(orders_1.getOrder).put(auth_1.adminOnly, orders_1.processOrder).delete(auth_1.adminOnly, orders_1.deleteOrder);
exports.default = app;
