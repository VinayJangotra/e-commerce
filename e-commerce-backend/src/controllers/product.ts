import { rm } from "fs";
import { TryCatch } from "../middlewares/error";
import { Product } from "../models/product";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types";
import { Request } from "express";
import ErrorHandler from "../utils/utility-class";
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

// Search Functionality 
export const getAllProduct = TryCatch(async (req:Request<{},{},{},SearchRequestQuery>, res, next) => {
  const {search,sort,category,price}=req.query;
  const page =Number(req.query.page)|| 1;
  const limit = Number(process.env.PRODUCT_PER_PAGE)||8;
  const skip = (page - 1) * limit;
  const baseQuery:BaseQuery={};
  if(search)baseQuery.name={
    $regex:search,
    $options:"i"
  };
  if(category)baseQuery.category=category;
  if(price)baseQuery.price={
    $lte:Number(price)
  
  };

  // Pagination inn which we skip the products in order to show to the next page
  const products = await Product.find(baseQuery).sort(sort &&{ price: sort==="asc"?1:-1 }).limit(limit).skip(skip);
  const count = await Product.find(baseQuery);
  const totalPage= Math.ceil(count.length/limit);
  return res.status(200).json({
    status: "success",
    products,
    totalPage
  });
}); 
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