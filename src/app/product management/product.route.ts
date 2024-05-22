import express from 'express'
import { ProductControllers } from './product.controller'

const router = express.Router()

router.post('/', ProductControllers.createProduct)

router.get('/', ProductControllers.getAllProducts)

router.get('/:productId', ProductControllers.updateProductById)

router.put('/:productId', ProductControllers.updateProductById)

router.delete('/:productId', ProductControllers.deleteProduct)



export const  ProductRoutes = router