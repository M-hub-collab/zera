import pkg from 'pg'
import {configDotenv} from 'dotenv'
const { Pool } = pkg

configDotenv()

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    max: 10, // connection limit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export default pool;