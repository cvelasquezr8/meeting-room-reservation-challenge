import express from 'express';
import { AuthRouter, UserRouter } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);

export default app;
