import pool from "../../dbConfiguration/db_config.js";
import jwt from 'jsonwebtoken'

export const addNewCategory = async(req, res)=>
{
    try
    {
        const data = req.body
        const token = req.cookies._zerakey
        const username = jwt.decode(token).username

        const query = 'INSERT INTO categories(name, slug, description, isActive, created_by) values(?,?,?,?,?)'
        const values = [data.name, data.slug, data.description, data.isActive, username]

        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
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

        const query = 'update categories set name=?, slug=?, description=?, isActive=?, created_by=? where sno=?'
        const values = [data.name, data.slug, data.description, data.isActive, username, data.sno]

        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
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

        const query = 'delete from categories where sno=?'
        const values = [data.sno]

        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
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

        const query = 'update categories set isActive=?, created_by=? where sno=?'
        const values = [data.isActive, username, data.sno]

        const [result] = await pool.query(query, values)
        if(result.affectedRows>0)
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
        const [result] = await pool.query(query)
        if(result.length>0)
        {
            return res.status(201).json({data : result})
        }
        else
        {
            return res.status(401).json({message : 'Failed to get categories'})
        }
    }
    catch(error)
    {
        console.log("Error is : ", error)
        return res.status(500).json({message : error})
    }
}