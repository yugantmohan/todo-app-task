"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// test-server.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/auth/signup', (req, res) => {
    console.log('✅ Signup route hit!');
    res.status(200).json({ message: 'Signup worked!' });
});
app.listen(5000, () => console.log('✅ Test server running on port 5000'));
