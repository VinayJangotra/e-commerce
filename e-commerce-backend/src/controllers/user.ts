import { NextFunction,Request,Response } from "express";
import {z} from "zod";
import { User } from "../models/user";
import { NewUserRequestBody } from "../types/types";
import { TryCatch } from "../middlewares/error";
// Zod Validation
const signupBody=z.object({
    name:z.string(),
    email:z.string().email(),
    photo:z.string(),
    gender:z.string(),
    _id:z.string(),
})
export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    
      const { success, error } = signupBody.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          message: "Invalid request body",
          error: error?.formErrors.fieldErrors ?? null,
        });
      }

      const existingUser = await User.findOne({
        email: req.body.email,
      });

      if (existingUser) {
        return res.status(411).json({
          message: "Email already taken/Incorrect inputs",
        });
      }
      const { name, email, photo, gender, _id, dob } = req.body;
      let user =await User.findById(_id);
      if(user){
        return res.status(411).json({
          message: `Welcome, ${user.name}`,
        });}
      if(!_id || !name || !email || !photo || !gender || !dob){
        return res.status(411).json({
          message: "All fields are required",
        });
      }
       user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
      });
      res.status(201).json({
        success:true,
        message: `Welcome ${user.name}`
      });
    
  }
);
// Get all The Users
export const getAllUsers = TryCatch(async (req,res,next)=>{
  const users=await User.find();
  res.status(200).json({
    success: true,
    message: `Welcome ${users}`,
  });
})
// Get the User by Id
export const getUser = TryCatch(async (req, res, next) => {
  const id=req.params.id;
  const user = await User.findById(id);
  if(!user){
    return res.status(404).json({
      message:"User not found"
    })
  }
  res.status(200).json({
    success: true,
    message: `Welcome ${user.name}`,
  });
});

// Delete the User
export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `User ${user.name} deleted`,
  });
});