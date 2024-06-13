import mongoose from 'mongoose'
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