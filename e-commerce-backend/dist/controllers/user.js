"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.newUser = void 0;
const zod_1 = require("zod");
const user_1 = require("../models/user");
const error_1 = require("../middlewares/error");
// Zod Validation
const signupBody = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    photo: zod_1.z.string(),
    gender: zod_1.z.string(),
    _id: zod_1.z.string(),
});
exports.newUser = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { success, error } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid request body",
            error: (_a = error === null || error === void 0 ? void 0 : error.formErrors.fieldErrors) !== null && _a !== void 0 ? _a : null,
        });
    }
    const existingUser = yield user_1.User.findOne({
        email: req.body.email,
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs",
        });
    }
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = yield user_1.User.findById(_id);
    if (user) {
        return res.status(411).json({
            message: `Welcome, ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return res.status(411).json({
            message: "All fields are required",
        });
    }
    user = yield user_1.User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    res.status(201).json({
        status: "success",
        data: { user },
    });
}));
exports.getAllUsers = (0, error_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    res.status(200).json({
        status: "success",
        data: { users }
    });
}));
