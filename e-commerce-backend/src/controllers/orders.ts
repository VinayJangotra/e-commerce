import { TryCatch } from "../middlewares/error";
import { Order } from "../models/order";
import { NewOrderRequestBody } from "../types/types";
import { Request } from "express";
import { invalidatesCache, reduceStock } from "../utils/features";
export const newOrder=TryCatch(async(req:Request<{},{},NewOrderRequestBody>,res,next)=>{
    const {shippingInfo,orderItems,user,subtotal,tax,shippingCharges,discount,total}=req.body;
      if (
        !shippingInfo ||
        !orderItems ||
        !user ||
        subtotal === undefined ||
        tax === undefined ||
        shippingCharges === undefined ||
        discount === undefined ||
        total === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

    await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total
    })
  await   reduceStock(orderItems);

  await invalidatesCache({product:true,order:true,admin:true});
  return res.status(201).json({
    success:true,
    message:'order placed successfully',
    
  })
})