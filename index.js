import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './routes/index.js';
import errorHandler from './middleware/ErrorHandlingMiddleware.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started ${PORT}!`));
  } catch (e) {
    console.log(e);
  }
};

start();
