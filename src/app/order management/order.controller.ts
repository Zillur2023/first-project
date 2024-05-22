import { Request, Response } from 'express';
import { OrderService } from './order.service';

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;

    // const zodParsedData = studentValidationSchema.parse(product)

    const result = await OrderService.createOrderIntoDB(order);

    res.status(200).json({
      success: true,
      message: "Order created successfully!",
      data: result,
    });
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
    const email = req.query.email
     console.log(email)
    if (!email ) {
      result = await OrderService.getAllOrdersFromDB();

      res.status(200).json({
        success: true,
        message: "Orders fetched successfully!",
        data: result,
      });
    } else {
      result = await OrderService.searchEmailFromDB();

      res.status(200).json({
        success: true,
        message: "Orders fetched successfully for user email!",
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
