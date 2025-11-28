import express from 'express'
import { adminLogin } from '../inventory/Login/login_index.js'

const auth_routes = express.Router()

// ==> Login
auth_routes.post('/admin/login', adminLogin)

export default auth_routes