import pool from "../../dbConfiguration/db_config.js";
import jwt from 'jsonwebtoken'

export const addWarehouse = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username
        const query = 'INSERT INTO warehouses(name, phone, address1, address2, city, pincode, state, country, email, capacity, currentStock, status, products, default_address, created_by) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        const values = [data.name, data.phone, data.addressLine1, data.addressLine2, data.city, data.pincode, data.state, data.country, data.email,data.capacity, data.currentStock, data.status, data.products, data.isDefault, username]
        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
        {
            return res.status(200).json({message : 'New warehouse Added✅'})
        }
        else
        {
            return res.status(401).json({message : 'Unable to add Warehouse'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

export const editWarehouse = async(req, res)=>
{
    try
    {
        const {sno, data} = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username
        const query = 'UPDATE warehouses SET name=?, phone=?, address1=?, address2=?, city=?, pincode=?, state=?, country=?, email=?, capacity=?, currentStock=?, status=?, products=?, default_address=?, created_by=? WHERE sno=?'
        const values = [data.name, data.phone, data.addressLine1, data.addressLine2, data.city, data.pincode, data.state, data.country, data.email,data.capacity, data.currentStock, data.status, data.products, data.isDefault, username, sno]
        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
        {
            return res.status(200).json({message : 'Warehouse Updated✅'})
        }
        else
        {
            return res.status(401).json({message : 'Unable to update Warehouse'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

export const deleteWarehouse = async(req, res)=>
{
    try
    {
        const data = req.body
        const query = 'delete from warehouses where sno=?'
        const [result] = await pool.query(query,[data.sno])
        if(result.affectedRows>0)
        {
            return res.status(200).json({message : 'Warehouse deleted successfully'})
        }
        else
        {
            return res.status(401).json({message : 'Unable to delete Warehouses'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

export const getAllWarehouses = async(req, res)=>
{
    try
    {
        const query = 'select * from warehouses'
        const [result] = await pool.query(query)
        if(result.length>0)
        {
            return res.status(200).json({data : result})
        }
        else
        {
            return res.status(401).json({message : 'Unable to fetch Warehouses'})
        }
    }   
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

