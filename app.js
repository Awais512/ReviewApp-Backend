import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

//Route files Import
import userRoutes from './routes/userRoutes.js';
import connectDb from './db.js';
const app = express();

//Connecting to Mongodb
connectDb();

//App Middleware
app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

//Route Middlewares
app.use('/api/users', userRoutes);
app.get('/test', (req, res) => {
  res.send('Hiiiiii');
});
app.listen(process.env.PORT, () =>
  console.log(`Server is Running on Port ${process.env.PORT}`)
);
