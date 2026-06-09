import express from 'express'
import { addNewCategory, deleteCategory, editCategory, getAllCategories, toggleActiveInactive } from '../inventory/categories/categories_index.js'

const category_routes = express.Router()

// ===> Add New Category
category_routes.post('/add/new/category', addNewCategory)

// ===> Update Category
category_routes.post('/update/category', editCategory)

// ===> Delete Category
category_routes.post('/delete/category', deleteCategory)

// ===> Toggle active/inactive
category_routes.post('/toggle/category/status', toggleActiveInactive)

// ===> Get all categories
category_routes.get('/get/all/categories', getAllCategories)


export default category_routes