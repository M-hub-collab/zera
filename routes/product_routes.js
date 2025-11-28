import express from 'express'
import { addProduct, deleteProduct, editProduct, getAllProducts } from '../inventory/products/products_index.js'

const product_routes = express.Router()

// ==> Add New Product
product_routes.post('/add/new/product', addProduct)

// ==> Update Product
product_routes.post('/update/product', editProduct)

// ==> Delete Product
product_routes.post('/delete/product', deleteProduct)

// ==> Get all products
product_routes.get('/get/all/products', getAllProducts)

export default product_routes