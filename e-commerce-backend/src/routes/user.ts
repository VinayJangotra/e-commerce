import  express  from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user";
const app = express.Router();
app.post("/new",newUser);
// routes = /api/v1/user/all
app.get("/all",getAllUsers);
// routes = /api/v1/user/dynamic id
// This is the alternate way of writing the routes in which the path are same
app.route("/:id").get(getUser).delete(deleteUser);
export default app;