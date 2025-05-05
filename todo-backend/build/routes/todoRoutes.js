"use strict";
// src/routes/todoRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_js_1 = require("../controllers/todoController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = express_1.default.Router();
router.get('/', authMiddleware_js_1.authenticateToken, todoController_js_1.getTodos);
router.post('/', authMiddleware_js_1.authenticateToken, todoController_js_1.createTodo);
router.put('/:id', authMiddleware_js_1.authenticateToken, todoController_js_1.updateTodo);
router.delete('/:id', authMiddleware_js_1.authenticateToken, todoController_js_1.deleteTodo);
router.patch('/reorder', authMiddleware_js_1.authenticateToken, todoController_js_1.reorderTodos);
exports.default = router;
