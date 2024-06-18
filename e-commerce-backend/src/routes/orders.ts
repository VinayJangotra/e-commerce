import express from "express";
import { newOrder } from "../controllers/orders";

const app = express.Router();
app.post("/new", newOrder);
export default app;
