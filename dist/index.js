"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const mongoose_1 = __importDefault(require("mongoose"));
const route_1 = __importDefault(require("./routes/route"));
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://ice-009:Armaan%4006@cluster0.ynzphiq.mongodb.net/';
mongoose_1.default.connect(MONGO_URI);
app.use('/api/translate', route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
