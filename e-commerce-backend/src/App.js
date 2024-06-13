"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var port = 3000;
// Importing the user Routes
var user_1 = require("../routes/user");
var app = (0, express_1.default)();
app.use("/api/v1/user", user_1.default);
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
