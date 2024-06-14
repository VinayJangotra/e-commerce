import {NextFunction, Request, Response} from "express";
import ErrorHandler from "../utils/utility-class";
import { ControllerType } from "../types/types";
export const errorMiddlewware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    err.message ||= "Invalid Server Error";
    err.statusCode ||= 500;
  res.status(err.statusCode).json({
    status: "fail",
    message: err.message,
  });
};
export const TryCatch=(func:ControllerType)=>{
return  (req:Request, res:Response,next:NextFunction)=>{
    return Promise.resolve(func(req,res,next)).catch(next);
}

};