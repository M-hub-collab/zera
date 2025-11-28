import mysql2 from 'mysql2/promise'
import {configDotenv} from 'dotenv'

configDotenv()

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    timezone: '+05:30',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})

export default pool;