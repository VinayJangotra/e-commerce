import express from "express";

import { connectDB } from "./utils/features";
import { errorMiddlewware } from "./middlewares/error";

// Importing Routes
import userRoutes from "./routes/user"; // Ensure the path is correct
import productRoute from "./routes/products"

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000; 
connectDB();// Use environment variable or default to 3000
app.get("/",(req,res)=>{
    res.send("Hello World");
})
// Routes
app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoutes);


app.use(errorMiddlewware);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
