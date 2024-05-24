import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ProductRoutes } from './app/product management/product.route';
import { OrderRoutes } from './app/order management/order.route';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api/products', ProductRoutes);

app.use('/api/orders', OrderRoutes);

app.use((req: Request, res: Response, ) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
