import { z } from 'zod';


const variantValidationSchema = z.object({
  type: z.string(),
  value: z.union([z.string(), z.number()])
});

const inventoryValidationSchema = z.object({
  quantity: z.number(),
  inStock: z.boolean()
});

const productValidationSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  tags: z.array(z.string()),
  variants: z.array(variantValidationSchema),
  inventory: inventoryValidationSchema
});



export default productValidationSchema;