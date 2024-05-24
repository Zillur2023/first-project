import { Request, Response } from 'express';
import { ProductService } from './product.service';
import productValidationSchema from './product.validation';

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;

    const zodParsedData = productValidationSchema.parse(product)

    const result = await ProductService.createProductIntoDB(zodParsedData);

    

    res.status(200).json({
      success: true,
      message: "Product created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.issues.map(( err:any) => `${(err.message)} ---> ${err.path}`) || `Something went wrong`,
      error,
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    let result;
    const {searchTerm} = req.query

    if (!searchTerm ) {
      result = await ProductService.getAllProductsFromDB();

      const jsonData = {
        success: result[0]? true: false,
        message: result[0] ?"Products fetched successfully!":"No product available",
      }
      result[0]?jsonData.data = result:''

      res.status(result[0]?200:500).json(jsonData);

   
    } else if(searchTerm) {
      result = await ProductService.searchTermFromDB(searchTerm);
      

      const jsonData = {
        success: result[0]? true: false,
        message: result[0] ?`Products matching search term '${searchTerm}' fetched successfully!`:`No products matching search term '${searchTerm}' fetched fail!`,
      }
      result[0]?jsonData.data = result:''
      

        res.status(result[0]?200:404).json(jsonData);
     
      
    }
 
  } catch (error) {
 
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error
    });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.getProductByIdFromDB(productId);
    
    console.log(result)
    const jsonData = {
      success: result?true:false,
      message:result?"Product fetched successfully!":"The product not available",
    }
    result?jsonData.data=result:''

    res.status(result?200:404).json(jsonData);

  
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
      error
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
