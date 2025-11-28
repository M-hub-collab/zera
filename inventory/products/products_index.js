import pool from "../../dbConfiguration/db_config.js";
import jwt from 'jsonwebtoken'

export const addProduct = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username
        const query = `INSERT INTO products(
        name, category, warehouse, mrp, discount, finalPrice, stock, status,
        about, description, components_or_ingredients, benfits, how_to_use,
        expiry_date, weight, length, width, height, shipping_cost,
        gstApplicable, gst_rate, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        const values = [data.name, data.category, data.warehouse, data.mrp, data.discount, data.price, data.stock, data.status, data.about,data.description, data.components, data.benfits, data.howToUse, data.expiryDate,data.weight, data.length, data.width, data.height, data.customShippingCost, data.gstApplicable, data.gstRate, username]
        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
        {
            return res.status(200).json({message : 'New Product Added✅'})
        }
        else
        {
            return res.status(401).json({message : 'Unable to add Product'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

export const editProduct = async(req, res)=>
{
    try
    {
        const {sno, data, finalPrice} = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username
        const query = `UPDATE products SET
            name = ?,
            category = ?,
            warehouse = ?,
            mrp = ?,
            discount = ?,
            finalPrice = ?,
            stock = ?,
            status = ?,
            about = ?,
            description = ?,
            components_or_ingredients = ?,
            benfits = ?,
            how_to_use = ?,
            expiry_date = ?,
            weight = ?,
            length = ?,
            width = ?,
            height = ?,
            shipping_cost = ?,
            gstApplicable = ?,
            gst_rate = ?,
            created_by = ?
            WHERE sno = ?;
            `
        const values = [data.name, data.category, data.warehouse, data.mrp, data.discount, finalPrice, data.stock, data.status, data.about,data.description, data.components, data.benfits, data.howToUse, data.expiryDate,data.weight, data.length, data.width, data.height, data.customShippingCost, data.gstApplicable, data.gstRate, username, sno]
        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
        {
            return res.status(200).json({message : 'Product Updated✅'})
        }
        else
        {
            return res.status(401).json({message : 'Unable to Update Product'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

export const deleteProduct = async(req, res)=>
{
    try
    {
        const data = req.body
        const query = 'delete from products where sno=?'
        const [result] = await pool.query(query,[data.sno])
        if(result.affectedRows>0)
        {
            return res.status(200).json({message : 'Product deleted 🚮'})
        }
        else
        {
            return res.status(401).json({message : 'Unable to delete Product'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

export const getAllProducts = async(req, res)=>
{
    try
    {
        const query = 'select * from products'
        const [result] = await pool.query(query)
        if(result.length>0)
        {
            return res.status(200).json({data : result})
        }
        else
        {
            return res.status(401).json({message : 'Unable to fetch products'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}