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
exports.default = app;
