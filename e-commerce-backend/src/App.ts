import express from "express";
import userRoutes from "./routes/user"; // Ensure the path is correct
import { connectDB } from "./utils/features";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000; 
connectDB();// Use environment variable or default to 3000
app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.use("/api/v1/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
