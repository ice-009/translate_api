const express = require('express')
import mongoose from 'mongoose';
import translateRouter from './routes/route';


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://ice-009:Armaan%4006@cluster0.ynzphiq.mongodb.net/';

mongoose.connect(MONGO_URI);

app.use('/api/translate', translateRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});