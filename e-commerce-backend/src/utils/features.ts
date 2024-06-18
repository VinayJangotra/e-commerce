import mongoose from 'mongoose'
import { InvalidateCacheProps, orderItemType } from '../types/types';
import NodeCache from "node-cache";
import { Product } from '../models/product';
const myCache = new NodeCache();
export const connectDB= (uri:string)=>{
    mongoose.connect(uri, {
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

export const reduceStock =async (orderItems:orderItemType[])=>{
  for(let i=0;i<orderItems.length;i++){
    const order=orderItems[i];
    const product = await Product.findById(order.productId);
    if(!product) throw new Error('Product Not Found');
    product.stock=product.stock-order.quantity;
    await product.save();
  }
}