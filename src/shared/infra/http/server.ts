import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import appError from '@shared/errors/AppError';
import rateLimiter from './middlewares/RateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof appError) {
    return response
      .status(err.statusCode)
      .json({ status: 'Error', message: err.message });
  }

  console.log(err);

  return response.status(500).json({ status: 'error', message: err.message });
});

const port = 3333;

app.listen(port, () => {
  console.log(`🚀 server started on port: ${port} !`);
});
