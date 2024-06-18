import express from "express";
import { allOrders, deleteOrder, getOrder, myOrders, newOrder, processOrder } from "../controllers/orders";
import { adminOnly } from "../middlewares/auth";


const app = express.Router();
// route /api/v1/order/new
app.post("/new", newOrder);
// User  Orders
app.get("/my",myOrders);
// all orders
app.get("/all",adminOnly, allOrders);
// Get Single order
app.route('/:id').get(getOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder)
export default app;
