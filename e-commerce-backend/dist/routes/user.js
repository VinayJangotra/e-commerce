"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const app = express_1.default.Router();
app.post("/new", user_1.newUser);
// routes = /api/v1/user/all
app.get("/all", user_1.getAllUsers);
// routes = /api/v1/user/dynamic id
// This is the alternate way of writing the routes in which the path are same
app.route("/:id").get(user_1.getUser).delete(user_1.deleteUser);
exports.default = app;
