"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_js_1 = require("../controllers/authController.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const router = express_1.default.Router();
router.post('/signup', (0, asyncHandler_js_1.asyncHandler)(authController_js_1.signup));
router.post('/login', (0, asyncHandler_js_1.asyncHandler)(authController_js_1.login));
router.post('/refresh', (0, asyncHandler_js_1.asyncHandler)(authController_js_1.refreshToken));
router.post('/logout', (0, asyncHandler_js_1.asyncHandler)(authController_js_1.logout));
exports.default = router;
