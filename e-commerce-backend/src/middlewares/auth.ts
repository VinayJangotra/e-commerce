import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please Login  in", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User doesn't exist", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("You have  no permission to access the resources", 403));

  next();
});
