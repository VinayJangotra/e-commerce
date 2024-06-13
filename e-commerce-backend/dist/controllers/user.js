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
exports.newUser = void 0;
const zod_1 = require("zod");
const user_1 = require("../models/user");
// Zod Validation
const signupBody = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    photo: zod_1.z.string(),
    gender: zod_1.z.string(),
    _id: zod_1.z.string(),
});
const newUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success, error } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "Invalid request body",
                error: error.formErrors.fieldErrors,
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
        const user = yield user_1.User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob: new Date(dob),
        });
        res.status(201).json({
            status: "success",
            data: { user }
        });
    }
    catch (error) {
        res.status(500).json({
            status: "fail",
            message: error,
        });
    }
});
exports.newUser = newUser;
