import pool from "../../dbConfiguration/db_config.js"

async function createAdminsTable()
{
    try
    {
        const query = `CREATE TABLE admins(
            sno int primary key auto_increment,
            username varchar(100),
            password varchar(256),
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

const adminSessions = async()=>
{
    try
    {
        const query = `
            CREATE TABLE admin_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT,
            token VARCHAR(500),
            ip VARCHAR(100),
            device VARCHAR(100),
            login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
            );
        `
        const [result] = await pool.query(query)
        console.log("Result : ", result)
    }
    catch(error)
    {
        console.log("unable to create table", error)
    }
}

createAdminsTable()
// adminSessions()