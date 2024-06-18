import { Request, Response, NextFunction } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}
export interface NewProductRequestBody{
  name:string,
  category:string,
  price:number,
  stock:number,
}
// 1:10
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery={
  search?:string,
  price?:string,
  category?:string,
  sort?:string,
  page?:string
}

export interface BaseQuery{
  name?:{
    $regex:string,
    $options:string
  };
  price?:{
    $lte:number
  };
  category?:string;

  }
export type InvalidateCacheProps={
  product?:boolean;
  order?:boolean;
  admin?:boolean;
}
export type orderItemType={
  name:string;
  photo:string;
  price:number;
  quantity:number;
  productId:string;

}
export  type shippingInfoType={
  address:string;
  city:string;
  pinCode:number;
  state:string;
  country:string;
}
export interface NewOrderRequestBody{
  shippingInfo:shippingInfoType;
  user:string;
  subtotal:number;
  tax:number;
  shippingCharges:number;
  discount:number;
  total:number;
  orderItems:orderItemType[]
}