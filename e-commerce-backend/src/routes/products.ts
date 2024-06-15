import express from "express";
import { adminOnly } from "../middlewares/auth";
import { singleUpload } from "../middlewares/multer";
import { newProduct } from "../controllers/product";
const app = express.Router();
// Creation of the new product
app.post("/new",singleUpload,newProduct);
export default app;
