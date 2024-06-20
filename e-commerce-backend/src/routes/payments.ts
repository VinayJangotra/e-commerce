import express from "express";
import { adminOnly } from "../middlewares/auth";
import { newCoupon } from "../controllers/payment";
const app = express.Router();
// Creation of the new product
app.post("/coupon/new",newCoupon);


export default app;
