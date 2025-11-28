import express from 'express'
import { addWarehouse, deleteWarehouse, editWarehouse, getAllWarehouses } from '../inventory/warehouses/warehouse_index.js'

const warehouse_routes = express.Router()

// =======> Add new warehouse
warehouse_routes.post('/add/new/warehouse', addWarehouse)

// =======> Update warehouse
warehouse_routes.post('/update/warehouse', editWarehouse)

// =======> Delete warehouse
warehouse_routes.post('/delete/a/warehouse', deleteWarehouse)

// =======> Get all warehouses
warehouse_routes.get('/get/all/warehouses', getAllWarehouses)

export default warehouse_routes