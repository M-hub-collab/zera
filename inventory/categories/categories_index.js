import pool from "../../dbConfiguration/db_config.js";
import jwt from 'jsonwebtoken'

export const addNewCategory = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username

        const query = 'INSERT INTO categories(name, slug, description, isActive, created_by) values($1,$2,$3,$4,$5)'
        const values = [data.name, data.slug, data.description, data.isActive, username]

        const result = await pool.query(query, values)
        if(result.rowCount>0)
        {
            return res.status(201).json({message : 'Category Added✅'})
        }
        else
        {
            return res.status(401).json({message : 'Failed to add Category❌'})
        }
    }
    catch(error)
    {
        console.log("Error is : ", error)
        return res.status(500).json({message : error})
    }
}

export const editCategory = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username

        const query = 'update categories set name=$1, slug=$2, description=$3, isActive=$4, created_by=$5 where sno=$6'
        const values = [data.name, data.slug, data.description, data.isActive, username, data.sno]

        const result = await pool.query(query, values)
        if(result.rowCount>0)
        {
            return res.status(201).json({message : 'Category Updated✅'})
        }
        else
        {
            return res.status(401).json({message : 'Failed to update Category❌'})
        }
    }
    catch(error)
    {
        console.log("Error is : ", error)
        return res.status(500).json({message : error})
    }
}

export const deleteCategory = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username

        const query = 'delete from categories where sno=$1'
        const values = [data.sno]

        const result = await pool.query(query, values)
        if(result.rowCount>0)
        {
            return res.status(201).json({message : 'Category Deleted 🚮'})
        }
        else
        {
            return res.status(401).json({message : 'Failed Deleting Category❌'})
        }
    }
    catch(error)
    {
        console.log("Error is : ", error)
        return res.status(500).json({message : error})
    }
}

export const toggleActiveInactive = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username

        const query = 'update categories set isActive=$1, created_by=$2 where sno=$3'
        const values = [data.isActive, username, data.sno]

        const result = await pool.query(query, values)
        if(result.rowCount>0)
        {
            return res.status(201).json({message : 'Success'})
        }
        else
        {
            return res.status(401).json({message : 'Failed❌'})
        }
    }
    catch(error)
    {
        console.log("Error is : ", error)
        return res.status(500).json({message : error})
    }
}

export const getAllCategories = async(req, res)=>
{
    try
    {
        const query = 'SELECT * FROM categories'
        const result = await pool.query(query)
        return res.status(200).json({data : result.rows})
    }
    catch(error)
    {
        console.log("Error is : ", error)
        return res.status(500).json({message : error})
    }
}