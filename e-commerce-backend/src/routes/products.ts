import express from "express";
import { adminOnly } from "../middlewares/auth";
import { singleUpload } from "../middlewares/multer";
import { newProduct,getLatestProduct } from "../controllers/product";
const app = express.Router();
// Creation of the new product
app.post("/new",adminOnly,singleUpload,newProduct);
// Get the latest product
app.get("/latest",getLatestProduct);
export default app;
