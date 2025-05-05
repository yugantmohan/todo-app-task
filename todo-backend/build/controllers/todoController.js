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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderTodos = exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const Todo_js_1 = __importDefault(require("../models/Todo.js"));
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { search = '', status, page = 1, limit = 5 } = req.query;
    try {
        const query = Object.assign(Object.assign({ owner: userId }, (status ? { status } : {})), { $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ] });
        const skip = (Number(page) - 1) * Number(limit);
        const todos = yield Todo_js_1.default.find(query)
            .sort({ position: 1 })
            .skip(skip)
            .limit(Number(limit));
        const total = yield Todo_js_1.default.countDocuments(query);
        res.json({
            todos,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    }
    catch (error) {
        console.error('[TODO] Get todos error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTodos = getTodos;
// CREATE a new todo
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { title, description, dueDate } = req.body;
    try {
        const latestTodo = yield Todo_js_1.default.find({ owner: userId }).sort({ position: -1 }).limit(1);
        const nextPosition = latestTodo.length > 0 ? latestTodo[0].position + 1 : 0;
        const todo = new Todo_js_1.default({
            title,
            description,
            dueDate,
            status: 'pending',
            owner: userId,
            position: nextPosition,
        });
        yield todo.save();
        res.status(201).json(todo);
    }
    catch (error) {
        console.error('[TODO] Create todo error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createTodo = createTodo;
// UPDATE a todo
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const todo = yield Todo_js_1.default.findOneAndUpdate({ _id: id, owner: userId }, req.body, { new: true });
        if (!todo) {
            res.status(404).json({ message: 'Todo not found or unauthorized' });
            return;
        }
        res.json(todo);
    }
    catch (error) {
        console.error('[TODO] Update todo error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateTodo = updateTodo;
// DELETE a todo
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const todo = yield Todo_js_1.default.findOneAndDelete({ _id: id, owner: userId });
        if (!todo) {
            res.status(404).json({ message: 'Todo not found or unauthorized' });
            return;
        }
        res.json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        console.error('[TODO] Delete todo error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteTodo = deleteTodo;
const reorderTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { orderedIds } = req.body;
    try {
        for (let i = 0; i < orderedIds.length; i++) {
            yield Todo_js_1.default.updateOne({ _id: orderedIds[i], owner: userId }, { position: i });
        }
        res.json({ message: 'Todos reordered successfully' });
    }
    catch (error) {
        console.error('[TODO] Reorder error:', error);
        res.status(500).json({ message: 'Failed to reorder todos' });
    }
});
exports.reorderTodos = reorderTodos;
