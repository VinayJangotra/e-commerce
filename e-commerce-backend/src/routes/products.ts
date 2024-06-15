import express from "express";
import { adminOnly } from "../middlewares/auth";
import { singleUpload } from "../middlewares/multer";
import { newProduct,getLatestProduct, getCategories, getAdminProduct, getSingleProduct, updateProduct, deleteProduct } from "../controllers/product";
const app = express.Router();
// Creation of the new product
app.post("/new",adminOnly,singleUpload,newProduct);
// Get the latest product
app.get("/latest",getLatestProduct);
//g Get all the categories
app.get("/category",getCategories)
// Get all the prfoducts from the list
app.get("/admin-products",adminOnly, getAdminProduct);
// Get single product and updation product
app.route("/:id").get(getSingleProduct).put(singleUpload,updateProduct).delete(singleUpload,deleteProduct)
export default app;
