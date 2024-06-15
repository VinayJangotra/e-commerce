import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter your photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter your Price"],
    },
    stock:{
        type:Number,
        required:[true,"Please enter the stock"],
    },
    category:{
        type:String,
        required:[true,"Please enter the category"],
        trim:true
    },

  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
