import { Product } from '../product management/product.model';
import { ProductRoutes } from '../product management/product.route';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const createOrderIntoDB = async (order: TOrder) => {
  const data =await Order.aggregate([
    // {$project: {projectId: 1, price:1}}
    {
      $lookup:
        {
          from: 'Product',
          localField: 'productId',
          foreignField: '_id',
          as: 'user'
        }
   }
  ])
  console.log(data)
  
  const result = await Order.create(order); 

  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await Order.find();

  return result;
};

const searchEmailFromDB = async () => {
  const result = await Order.find({ email: { $regex: 'level2@programming-hero.com', $options: 'i' }});

  return result;
};

const getProductByIdFromDB = async (productId: string) => {
  // const result = await Product.findOne({_id:productId});
  const result = await Order.findById(productId);

  return result;
};

const updateProductByIdFromDB = async (productId: string, updateData: any) => {
  const result = await Order.findOneAndUpdate(
    { _id: productId },
    // { $set: updateData },
    updateData,
    { new: true, upsert: true },
  );

  return result;
};

const deleteProductFromDB = async (productId: string) => {
  const result = await Order.findByIdAndDelete(productId);

  return result;
};

export const OrderService = {
   createOrderIntoDB,
   getAllOrdersFromDB,
   searchEmailFromDB,
  getProductByIdFromDB,
  updateProductByIdFromDB,
  deleteProductFromDB,
};
