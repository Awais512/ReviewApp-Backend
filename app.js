const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error');
dotenv.config();

//Route files Import
const userRoutes = require('./routes/userRoutes');
const connectDb = require('./db');
const { handleNotFound } = require('./utils/helper');
const app = express();

//Connecting to Mongodb
connectDb();

//App Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

//Route Middlewares
app.use('/api/users', userRoutes);

app.use('/*', handleNotFound);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is Running on Port ${process.env.PORT}`)
);
