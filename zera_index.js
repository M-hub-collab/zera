import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import auth_routes from './routes/auth_routes.js'
import category_routes from './routes/category_routes.js'
import warehouse_routes from './routes/warehouse_routes.js'
import product_routes from './routes/product_routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 6000

// parse data as json
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin : [
        'http://localhost:3000',
        'http://72.61.225.131:3010'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,  
}))

// ==> Admin Routes
app.use('/auth', auth_routes)

// ==> Category Routes
app.use('/category', category_routes)

// ==> warehouse routes
app.use('/warehouse', warehouse_routes)

// ==> Product routes
app.use('/product', product_routes)

app.use(express.json())

//  testing url
app.get('/', (req, res) => 
{
    res.send('Hello from node.js Zera Naturals backend!');
})

app.listen(PORT, ()=>
{
    console.log(`Server running on http://localhost:${PORT}`)
})