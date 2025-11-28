import pool from "../../dbConfiguration/db_config.js"

async function createProductsTable()
{
    try
    {
        const query = `CREATE TABLE products(
            sno int primary key auto_increment,
            name varchar(100),
            category varchar(100),
            stock int,
            expiry_date datetime,
            mrp varchar(10),
            discount varchar(10),
            warehouse  text,
            weight varchar(10),
            shipping_cost varchar(10),
            length varchar(10),
            width varchar(10),
            height varchar(10),
            gstApplicable boolean,
            gst_rate varchar(10),
            about text,
            description text,
            components_or_ingredients text,
            benfits text,
            how_to_use text,
            isActive boolean,
            created_by varchar(100),
            created_at datetime default current_timestamp,
            updated_at datetime default current_timestamp on update current_timestamp
        )`
        const [result] = await pool.query(query)
        console.log("Result : ", result)
    }
    catch(error)
    {
        console.log("Unable to create table", error)
    }
}

createProductsTable()