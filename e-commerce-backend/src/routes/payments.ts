import express from "express";
import { adminOnly } from "../middlewares/auth";
import { allCoupons, applyDiscount, newCoupon ,deleteCoupon} from "../controllers/payment";
const app = express.Router();
// Creation of the new product
app.post("/coupon/new",adminOnly,newCoupon);

// Route fo the checking the existence of the coupon and apply the discount
app.get("/discount",applyDiscount);
// Get all the coupons
app.get("/discount/all",adminOnly, allCoupons);
// Dleete all the coupons
app.delete("/coupon/:id",adminOnly, deleteCoupon);
export default app;
