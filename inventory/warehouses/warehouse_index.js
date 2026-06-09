import pool from "../../dbConfiguration/db_config.js";
import jwt from 'jsonwebtoken'

export const addWarehouse = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username
        const query = 'INSERT INTO warehouses(name, phone, address1, address2, city, pincode, state, country, email, capacity, currentStock, status, products, default_address, created_by) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)'
        const values = [data.name, data.phone, data.addressLine1, data.addressLine2, data.city, data.pincode, data.state, data.country, data.email,data.capacity, data.currentStock, data.status, data.products, data.isDefault, username]
        const result = await pool.query(query, values)
        if(result.rowCount>0)
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
        const query = 'UPDATE warehouses SET name=$1, phone=$2, address1=$3, address2=$4, city=$5, pincode=$6, state=$7, country=$8, email=$9, capacity=$10, currentStock=$11, status=$12, products=$13, default_address=$14, created_by=$15 WHERE sno=$16'
        const values = [data.name, data.phone, data.addressLine1, data.addressLine2, data.city, data.pincode, data.state, data.country, data.email,data.capacity, data.currentStock, data.status, data.products, data.isDefault, username, sno]
        const result = await pool.query(query, values)
        if(result.rowCount>0)
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
         // TEMPORARY: delete all warehouse records
         await pool.query('DELETE FROM warehouses');

        const data = req.body
        const query = 'delete from warehouses where sno=$1'
        const result = await pool.query(query,[data.sno])
        if(result.rowCount>0)
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
        const result = await pool.query(query)
        if(result.rows.length>0)
        {
            return res.status(200).json({data : result.rows})
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

