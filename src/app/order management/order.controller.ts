import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { Product } from '../product management/product.model';
import { ObjectId } from 'mongodb';

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const orderQuantity = order.quantity;
    const allProducts = await Product.find();

    const targetProduct = allProducts.filter(
      (item) => item._id.toString() == order.productId,
    );
    const productQuantity = targetProduct[0]?.inventory?.quantity;
    const quantity = productQuantity >= orderQuantity;

    let result;

    if (targetProduct && quantity) {
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
      // console.log(JSON.stringify({ aggregateResult }, null, 2));
      console.log(JSON.stringify(aggregateResult[0].inventory));
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

      result = await OrderService.createOrderIntoDB(order);

      res.status(200).json({
        success: true,
        message: 'Order created successfully!',
        data: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Insufficient quantity available in inventory',
        data: result,
      });
    }

    return result;

    // const result = await OrderService.createOrderIntoDB(order);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    let result;
    // console.log('result',result)
    const email = req.query.email;
    console.log(email);
    if (!email) {
      result = await OrderService.getAllOrdersFromDB();

      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully!',
        data: result,
      });
    } else {
      result = await OrderService.searchEmailFromDB();

      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully for user email!',
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
};