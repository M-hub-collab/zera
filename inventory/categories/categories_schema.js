import pool from "../../dbConfiguration/db_config.js"

async function createTable()
{
    try
    {
        // const query = `CREATE TABLE categories(
        //     sno int primary key auto_increment,
        //     name varchar(100),
        //     slug varchar(100),
        //     description  text,
        //     isActive boolean,
        //     created_by varchar(100),
        //     created_at datetime default current_timestamp,
        //     updated_at datetime default current_timestamp on update current_timestamp
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