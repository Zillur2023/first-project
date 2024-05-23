import { Request, Response } from 'express';
import studentValidationSchema from './product.validation';
import { ProductService } from './product.service';

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;

    // const zodParsedData = studentValidationSchema.parse(product)

    const result = await ProductService.createProductIntoDB(product);

    res.status(200).json({
      success: true,
      message: "Product created successfully!",
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

const getAllProducts = async (req: Request, res: Response) => {
  try {
    let result;
    // console.log('result',result)
    const searchTerm = req.query.searchTerm
     console.log('searchTerm',searchTerm)
    if (!searchTerm ) {
      result = await ProductService.getAllProductsFromDB();

      res.status(200).json({
        success: true,
        message: "Products fetched successfully!",
        data: result,
      });
    } else {
      result = await ProductService.searchTermFromDB(searchTerm);

      res.status(200).json({
        success: true,
        message: "Products matching search term 'iphone' fetched successfully!",
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

const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.getProductByIdFromDB(productId);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  }
};

const updateProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    const result = await ProductService.updateProductByIdFromDB(
      productId,
      updateData,
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.deleteProductFromDB(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error,
    });
  }
};

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProduct,
};
