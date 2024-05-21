import express, { Application  } from 'express';
import cors from 'cors';
import { ProductRoutes } from './app/product/product.route';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api/products', ProductRoutes )



export default app;
