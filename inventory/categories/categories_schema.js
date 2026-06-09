import pool from "../../dbConfiguration/db_config.js"

async function createTable()
{
    try
    {
        // const query = `CREATE TABLE categories(
        //     sno SERIAL PRIMARY KEY,
        //     name varchar(100),
        //     slug varchar(100),
        //     description  text,
        //     isActive boolean,
        //     created_by varchar(100),
        //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        // )`
        const query = 'delete from categories'
        const [result] = await pool.query(query)
        console.log("Result : ", result)
    }
    catch(error)
    {
        console.log("Unable to create table", error)
    }
}

createTable()