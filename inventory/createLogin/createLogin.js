import pool from "../../dbConfiguration/db_config.js";
import bcrpt from 'bcrypt'

export const createLogin = async(req, res)=>
{
    try
    {
        const username = 'zera_admin'
        const password = 'zera_admin_@123'
        const saltRounds = 13

        const hashPassword = await bcrpt.hash(password, saltRounds)

        const query = `INSERT INTO admins(username, password) values(?,?)`;
        await pool.query(query, [username, hashPassword])
        console.log("New Admin created successfully")
    }
    catch(error)
    {
        console.log("Error is : ", error)
    }
}

createLogin()