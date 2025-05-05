"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    position: { type: Number, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Todo', todoSchema);
