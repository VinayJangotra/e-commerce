import express from "express";
import { adminOnly } from "../middlewares/auth";
import { singleUpload } from "../middlewares/multer";
import { newProduct,getLatestProduct, getCategories } from "../controllers/product";
const app = express.Router();
// Creation of the new product
app.post("/new",adminOnly,singleUpload,newProduct);
// Get the latest product
app.get("/latest",getLatestProduct);
//g Get all the categories
app.get("/category",getCategories)
export default app;
