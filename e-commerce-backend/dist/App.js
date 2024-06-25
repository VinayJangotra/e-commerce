"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myCache = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const features_1 = require("./utils/features");
const error_1 = require("./middlewares/error");
const node_cache_1 = __importDefault(require("node-cache"));
const dotenv_1 = require("dotenv");
// Importing Routes
const user_1 = __importDefault(require("./routes/user")); // Ensure the path is correct
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const payments_1 = __importDefault(require("./routes/payments"));
const stats_1 = __importDefault(require("./routes/stats"));
const cors_1 = __importDefault(require("cors"));
// Configuring the env file in the website
(0, dotenv_1.config)({
    path: "./.env",
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // CORS middleware should be one of the first to ensure CORS policy is applied
app.use(express_1.default.json()); // For parsing application/json
app.use((0, morgan_1.default)("dev"));
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";
(0, features_1.connectDB)(mongoURI); // Use environment variable or default to 3000
exports.myCache = new node_cache_1.default();
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Routes
app.use("/api/v1/products", products_1.default);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/order", orders_1.default);
app.use("/api/v1/payment", payments_1.default);
app.use("/api/v1/dashboard", stats_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use(error_1.errorMiddlewware);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
