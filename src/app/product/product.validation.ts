import { z } from 'zod';


// Define Zod schema for TVariant
const variantValidationSchema = z.object({
  type: z.string().min(1, { message: 'Variant type is required' }),
  // value: z.union([z.string(), z.number()]).min(1, { message: 'Variant value is required' })
  value: z.union([z.string(), z.number()])
});

// Define Zod schema for TInventory
const inventoryValidationSchema = z.object({
  quantity: z.number().int().min(0, { message: 'Inventory quantity is required' }),
  // inStock: z.boolean().min(0, { message: 'Inventory inStock status is required' })
  inStock: z.boolean()
});

// Define Zod schema for TProduct
const productValidationSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z.string().min(1, { message: 'Product description is required' }),
  price: z.number().min(0, { message: 'Product price is required' }),
  category: z.string().min(1, { message: 'Product category is required' }),
  tags: z.array(z.string()).min(1, { message: 'Product tags are required' }),
  variants: z.array(variantValidationSchema).min(1, { message: 'Product variants are required' }),
  // inventory: inventoryValidationSchema.min(1, { message: 'Product inventory is required' })
  inventory: inventoryValidationSchema
});



export default productValidationSchema;