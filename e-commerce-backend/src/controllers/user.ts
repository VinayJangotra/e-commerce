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
      const user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
      });
      res.status(201).json({
        status: "success",
        data: { user },
      });
    
  }
);
