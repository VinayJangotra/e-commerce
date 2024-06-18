import mongoose from 'mongoose'
import { InvalidateCacheProps } from '../types/types';
import NodeCache from "node-cache";
import { Product } from '../models/product';
const myCache = new NodeCache();
export const connectDB= ()=>{
    mongoose.connect("mongodb://localhost:27017", {
        dbName:"E-commerce_24"
      })
      .then(() => {
        console.log("Database connected successfully");
      })
      .catch((error) => {
        console.log("Error connecting to database", error);
      });
}
// This function is used to delete the cache in the memory
export const invalidatesCache= async ({product,order,admin}:InvalidateCacheProps)=>{
    if(product){
        const productKeys:string[]=[
            "latest-products",
            "categories",
            "all-products"
        ];
        const products= await Product.find({}).select("_id");
        products.forEach((key)=>{
          productKeys.push(`product-${key._id}`);
        });
         myCache.del(productKeys);
    }
    if(order){
        myCache.del("latest-orders");
    }
    if(admin){
        myCache.del("latest-admins");
    }
}