import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (product: TProduct) => {
  const result = await Product.create(product); // built in static method

  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find();

  return result;
}

const searchTermFromDB = async (searchTerm:any) => {
  const result = await Product.find({
    $or: [
      { description: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
    ]
  });
  // console.log('searchText',result)
  return result;
};

const getProductByIdFromDB = async (productId: string) => {
  // const result = await Product.findOne({_id:productId});
  const result = await Product.findById(productId);

  return result;
};

const updateProductByIdFromDB = async (productId: string,updateData:any) => {
  const result = await Product.findOneAndUpdate(
    { _id: productId }, 
    // { $set: updateData }, 
    updateData,
    { new: true, upsert: true } 
  );

  return result;
};

const deleteProductFromDB = async (productId: string) => {
  // const result = await Product.findOneAndDelete({_id:productId});
   await Product.findByIdAndDelete(productId);

   const result = Product.findById(productId)

  return result;
};



export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  searchTermFromDB,
  getProductByIdFromDB,
  updateProductByIdFromDB,
  deleteProductFromDB,
};
