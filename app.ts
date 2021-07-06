require('dotenv').config();

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import http from 'http';

import router from './src/router.root';
import apiAuthenticator from './src/utils/apiAuthenticator';


const app = express();

// Init server with socket.io and express app
let server = http.createServer(app);


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('common'));
const clientDir = path.resolve(__dirname, 'public');

// Static router
app.use('/uploads', express.static(process.env.NODE_ENV == 'production' ? clientDir : './src/uploads'));
app.use('/uploads', express.static(process.env.NODE_ENV == 'production' ? clientDir : './src/resouces'));

// Router
if (process.env.NODE_ENV == 'production') {
  app.use('/api/v1', apiAuthenticator, router);
} else {
  app.use('/api/v1', router);
}

// Catch errors
app.use((req: any, res: any, next: any) => {
  const error: any = new Error();
  error.status = 404;
  error.message = 'NOT_FOUND_ROUTE';
  error.name = 'NotFoundException';
  next(error);
});

app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.status || 500);
  res.json({
    message: error.name ? error.name : 'Unknown error',
    errors: [
      {
        message: error.message ? error.message : 'Unknown error',
      },
    ],
    status: error.status,
  });
});

// Mongodb connection
mongoose.connect(process.env.MONGO_URL ? process.env.MONGO_URL : '', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log(`Connected to database system.`);
});



server.listen(process.env.PORT, () => {
  console.log(`[HTTP] Server listening in port ${process.env.PORT}.`);
});

