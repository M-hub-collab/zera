import pool from "../../dbConfiguration/db_config.js"

async function createWarehouseTable()
{
    try
    {
        // const query = `CREATE TABLE warehouses(
        //     sno SERIAL PRIMARY KEY,
        //     name varchar(100),
        //     phone varchar(12),
        //     address1 text,
        //     address2 text,
        //     city varchar(50),
        //     pincode varchar(10),
        //     state varchar(50),
        //     country varchar(50),
        //     email varchar(100),
        //     capcity varchar(50),
        //     default_address boolean default false,
        //     created_by varchar(100),
        //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        // )`
        const query = 'alter table warehouses add column currentStock int'
        const [result] = await pool.query(query)
        console.log("Result : ", result)
    }
    catch(error)
    {
        console.log("Unable to create table", error)
    }
}

createWarehouseTable()