import { rm } from "fs";
import { TryCatch } from "../middlewares/error";
import { Product } from "../models/product";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types";
import { Request } from "express";
import ErrorHandler from "../utils/utility-class";
// import { myCache } from "../App";
import NodeCache from "node-cache";
import { invalidatesCache } from "../utils/features";
const myCache = new NodeCache();
// import  {faker} from "@faker-js/faker"

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
      rm(photo.path, () => {
        console.log("Photo removed");
      });
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
    await invalidatesCache({ product: true,admin:true });
    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
    });
  }
);

// Get the latest product

// Revalidate on new Update ordelete product saand new order

export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});
// Get all the categories
export const getCategories = TryCatch(async (req, res, next) => {
  // on the basis of the category field the  product is provided the categories
  let categories;
  if(myCache.has("categories")){
    categories = JSON.parse(myCache.get("categories") as string);
  }
 else{
  categories = await Product.distinct("category");
  myCache.set("categories", JSON.stringify(categories));
} 
  return res.status(200).json({
    status: "success",
    categories,
  });
});
///Get all the products a as a admin
export const getAdminProduct = TryCatch(async (req, res, next) => {
  // It gives all the products that are available in the list
  let product;
  if(myCache.has("all-products")){
    product = JSON.parse(myCache.get("all-products") as string);
  }
  else{
    product = await Product.find({});
    myCache.set("all-products", JSON.stringify(product));
  }
  return res.status(200).json({
    status: "success",
    product,
  });
});
// get single product
export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  if(myCache.has(`product-${req.params.id}`)){
    product = JSON.parse(myCache.get(`product-${req.params.id}`) as string);
  }
  else{
   product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Page  Not Found", 404));
  myCache.set(`product-${req.params.id}`,JSON.stringify(product));
  }
  return res.status(200).json({
    status: "success",
    product,
  });
});

// update the product
export const updateProduct = TryCatch(async (req, res, next) => {
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
  await invalidatesCache({ product: true,productId:String(product._id)});
  return res.status(201).json({
    status: "success",
    product,
    message: "Product updated, successfully",
  });
});
// Delete product
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Page  Not Found", 404));
  rm(product.photo, () => {
    console.log("Photo removed");
  });
  await product.deleteOne();
 await invalidatesCache({ product: true });
  return res.status(200).json({
    status: "success",
    message: "Product Deleted successfully",
  });
});

// Search Functionality
export const getAllProduct = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery: BaseQuery = {};
    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    if (category) baseQuery.category = category;
    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    // Pagination inn which we skip the products in order to show to the next page
    const products = await Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);
    const count = await Product.find(baseQuery);
    const totalPage = Math.ceil(count.length / limit);
    return res.status(200).json({
      status: "success",
      products,
      totalPage,
    });
  }
);
// This is used to generate the random products in the database using  the faker,js
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\ff78cc8d-af98-4abb-acab-08ee320d535c.jpeg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };
// generateRandomProducts(40);

//delete the Products from the database
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };
// deleteRandomsProducts(40);
