import express from "express";
import morgan from "morgan"
import { connectDB } from "./utils/features";
import { errorMiddlewware } from "./middlewares/error";
import NodeCache from "node-cache"
import { config } from "dotenv";
// Importing Routes
import userRoutes from "./routes/user"; // Ensure the path is correct
import productRoute from "./routes/products"
import orderRoute from "./routes/orders";
import paymentRoute from "./routes/payments";
import DashBoardRoute from "./routes/stats"
import Stripe from "stripe";
import cors from "cors"
// Configuring the env file in the website
config({
  path: "./.env",
});

const app = express();

// Middleware
app.use(cors()); // CORS middleware should be one of the first to ensure CORS policy is applied
app.use(express.json()); // For parsing application/json
app.use(morgan("dev"));

const port = process.env.PORT || 3000; 
const mongoURI=process.env.MONGO_URI || "";
connectDB(mongoURI);// Use environment variable or default to 3000
export const myCache = new NodeCache();
app.get("/",(req,res)=>{
    res.send("Hello World");
})
// Routes
app.use("/api/v1/products", productRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/payment",paymentRoute)
app.use("/api/v1/dashboard", DashBoardRoute);

app.use("/uploads",express.static("uploads"));
app.use(errorMiddlewware);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
