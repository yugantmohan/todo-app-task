"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const todoRoutes_js_1 = __importDefault(require("./routes/todoRoutes.js"));
const authMiddleware_js_1 = require("./middlewares/authMiddleware.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.status(200).json({ message: "healthy" });
});
// Routes
app.use('/api/auth', authRoutes_js_1.default); // Public
app.use('/api/todos', authMiddleware_js_1.authenticateToken, todoRoutes_js_1.default); // Protected
mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
