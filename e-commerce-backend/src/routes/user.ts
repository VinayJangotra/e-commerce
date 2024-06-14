import  express  from "express";
import { getAllUsers, newUser } from "../controllers/user";
const app = express.Router();
app.post("/new",newUser);
// routes = /api/v1/user/all
app.get("/all",getAllUsers);
export default app;