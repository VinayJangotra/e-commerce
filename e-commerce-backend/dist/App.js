"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user")); // Ensure the path is correct
const features_1 = require("./utils/features");
const error_1 = require("./middlewares/error");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
(0, features_1.connectDB)(); // Use environment variable or default to 3000
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1/user", user_1.default);
app.use(error_1.errorMiddlewware);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
