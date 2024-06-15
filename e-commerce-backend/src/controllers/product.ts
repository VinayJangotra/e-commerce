import { TryCatch } from "../middlewares/error";
import { Product } from "../models/product";
import { NewProductRequestBody } from "../types/types";
import { Request } from "express";


export const newProduct = TryCatch(async (req:Request<{},{},NewProductRequestBody>,res,next)=>{
            const { name, category, price, stock } = req.body;
            const photo=req.file;
            if(!name || !category || !price || !stock){
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
                photo:photo?.path,
                });
            
            return res.status(201).json({
                status: "success",
                message: "Product created successfully",
            })
            
            
        })
          

