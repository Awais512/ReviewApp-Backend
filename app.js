const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

//Route files Import
const userRoutes = require('./routes/userRoutes');
const connectDb = require('./db');
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
