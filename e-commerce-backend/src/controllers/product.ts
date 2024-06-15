import { rm } from "fs";
import { TryCatch } from "../middlewares/error";
import { Product } from "../models/product";
import { NewProductRequestBody } from "../types/types";
import { Request } from "express";
import ErrorHandler from "../utils/utility-class";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo) {
      return res.status(411).json({
        message: "Please upload a photo",
      });
    }
    if (!name || !category || !price || !stock) {
        // remove the photo if it already exist
        rm(photo.path,()=>{
            console.log("Photo removed");
        
        })
      return res.status(411).json({
        message: "All fields are required",
      });
    }

    //logic to create a new product
    await Product.create({
      name,
      category,
      price,
      stock,
      photo: photo?.path,
    });

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
    });
  }
);

// Get the latest product
export const getLatestProduct = TryCatch(
  async (req, res, next) => {
    // Get the products at the descending order on the abssis of creation if the we take 1 then it is sorted as ascending order
    const product = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
      status: "success",
      product,
    });
  }
);
// Get all the categories
export const getCategories = TryCatch(
  async (req, res, next) => {
    // on the basis of the category field the  product is provided the categories
    const categories = await Product.distinct("category");
    return res.status(200).json({
      status: "success",
      categories,
    });
  }
);
///Get all the products a as a admin
export const getAdminProduct = TryCatch(async (req, res, next) => {
  // It gives all the products that are available in the list
  const product = await Product.find({});
  return res.status(200).json({
    status: "success",
    product,
  });
});
// get single product 
export const getSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product)return next(new ErrorHandler("Page  Not Found",404));
  return res.status(200).json({
    status: "success",
    product,
  });
});


// update the product
export const updateProduct = TryCatch(
  async (req, res, next) => {
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

    return res.status(201).json({
      status: "success",
      product,
      message: "Product updated, successfully",
    });
  }
);
// Delete product
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Page  Not Found", 404));
  rm(product.photo,()=>{
        console.log("Photo removed");
  })
    await product.deleteOne();
  return res.status(200).json({
    status: "success",
    message:"Product Deleted successfully"
  });
});