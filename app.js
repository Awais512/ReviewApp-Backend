import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

//Route files Import
import userRoutes from './routes/userRoutes.js';
import connectDb from './db.js';
const app = express();

//Connecting to Mongodb
connectDb();

//App Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/users', userRoutes);
app.listen(8000, () =>
  console.log(`Server is Running on Port ${process.env.PORT}`)
);
