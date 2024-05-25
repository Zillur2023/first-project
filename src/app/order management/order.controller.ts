import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { Product } from '../product management/product.model';
// import { ObjectId } from 'mongodb';
import orderValidationSchema from './order.validation';
import { TJsonData } from '../config';

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const zodParsesdData = orderValidationSchema.parse(order);
    const orderQuantity = order.quantity;
    const allProducts = await Product.find();

    const targetProduct = allProducts.filter(
      (item) => item._id.toString() == order.productId,
    );
    const productQuantity = targetProduct[0]?.inventory?.quantity;
    const quantity = productQuantity >= orderQuantity;

    if (!targetProduct[0] || !quantity) {
      res.status(404).json({
        success: false,
        message:
          (!targetProduct[0] && 'Product id not match') ||
          (!quantity && 'Insufficient quantity available in inventory'),
      });
    } else if (targetProduct && quantity) {
      await Product.updateOne(
        { _id: targetProduct[0]._id },

        {
          $inc: { 'inventory.quantity': -orderQuantity },
        },
      );

      const aggregateResult = await Product.aggregate([
        {
          $match: {
            _id: targetProduct[0]._id,
            // _id: new ObjectId(order.productId)
          },
        },
        // {
        //   $set: {
        //     name: '123',
        //     "inventory.quantity": { $subtract: ["$inventory.quantity", orderQuantity] },
        //     "inventory.inStock": { $cond: [{ $gte: [{ $subtract: ["$inventory.quantity", orderQuantity] }, 1] }, true, false] }
        //   }
        // },
        { $project: { _id: 0, inventory: '$inventory.quantity' } },
      ]);
      const stock =
        aggregateResult[0].inventory == 0
          ? (targetProduct[0].inventory.inStock = false)
          : (targetProduct[0].inventory.inStock = true);

      await Product.updateOne(
        { _id: targetProduct[0]._id },

        {
          $set: { 'inventory.inStock': stock },
        },
      );

      const result = await OrderService.createOrderIntoDB(zodParsesdData);

      res.status(200).json({
        success: true,
        message: 'Order created successfully!',
        data: result,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.issues.map((err: any) => `${err.message} ---> ${err.path} `) ||
        `Something went wrong`,
      error,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    let result;
    const email = req.query.email;
    if (!email) {
      result = await OrderService.getAllOrdersFromDB();

      const jsonData: TJsonData = {
        success: result[0] ? true : false,
        message: result[0] ? 'Orders fetched successfully!' : 'Order not found',
      };

      result[0] ? (jsonData.data = result) : '';

      res.status(result[0] ? 200 : 404).json(jsonData);
    } else {
      result = await OrderService.searchEmailFromDB(email);

      // console.log(result[0])

      const jsonData: TJsonData = {
        success: result[0] ? true : false,
        message: result[0]
          ? 'Orders fetched successfully for user email!'
          : 'Order not found',
      };

      result[0] ? (jsonData.data = result) : '';

      res.status(result[0] ? 200 : 404).json(jsonData);
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
};
