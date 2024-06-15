import { rm } from "fs";
import { TryCatch } from "../middlewares/error";
import { Product } from "../models/product";
import { NewProductRequestBody } from "../types/types";
import { Request } from "express";

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