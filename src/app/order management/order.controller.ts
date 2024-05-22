import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { Product } from '../product management/product.model';

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const orderQuantity = order.quantity;
    const allProducts = await Product.find();

    const data = allProducts.filter(
      (item) => item._id.toString() == order.productId,
    );
    const productQuantity = data[0]?.inventory?.quantity;
    const quantity = productQuantity >= orderQuantity;
    const stock =
      productQuantity == 0
        ? (data[0].inventory.inStock = false)
        : (data[0].inventory.inStock = true);

        console.log(stock)

    let result;
    console.log({ result });
    if (data && quantity) {
      await Product.updateOne(
        { _id: data[0]._id },
        // { $inc: { 'inventory.quantity': -orderQuantity } },
        { $set: { 'inventory.inStock': stock } },
      );

      result = await OrderService.createOrderIntoDB(order);

      res.status(200).json({
        success: true,
        message: 'Order created successfully!',
        data: result,
      });
    } else {
      // throw new Error("Insufficient quantity available in inventory")
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
