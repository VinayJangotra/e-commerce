"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const schema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: [true, "Please enter your Id"]
    },
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator_1.default.isEmail, "Please enter a valid email"]
    },
    photo: {
        type: String,
        required: [true, "Please Add your Photo"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    dob: {
        type: Date,
        required: [true, "Please enter your Date of Birth"]
    },
}, {
    timestamps: true
});
//Virtual Attribute
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = new Date(this.dob);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()))
        age--;
    return age;
});
exports.User = mongoose_1.default.model("User", schema);
