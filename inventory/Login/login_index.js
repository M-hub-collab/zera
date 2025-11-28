import pool from "../../dbConfiguration/db_config.js";
import bcrypt from 'bcrypt'
import { UAParser } from "ua-parser-js";
import jwt from 'jsonwebtoken'

export const adminLogin = async(req, res)=>
{
    try
    {
        const {username, password} = req.body
        console.log("Attempting to login : ", req.body)
        const userAgent = req.headers['user-agent'];
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const parser = new UAParser(userAgent)
        const deviceInfo = parser.getResult()

        // checking whether user exists or not
        const [result] = await pool.query('SELECT * FROM admins WHERE username=?', [username])
        if(result.length === 0) return res.status(400).json({message : 'No user found'})

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message : 'Invalid Password'})

        if(result.length === 0) return res.status(404).json({message : 'User not found'})
        const token = jwt.sign({userId : user.sno, username:user.username}, process.env.JWT_SECRET, {expiresIn : '2h'})

        const insertQuery = `INSERT INTO admin_sessions(admin_id, token, ip, device) values(?,?,?,?)`
        const [insertQuery_result] = await pool.query(insertQuery, [user.sno, token, ip, `${deviceInfo.browser.name} on ${deviceInfo.os.name}`])
        if(insertQuery_result.affectedRows>0)
        {
            res.cookie('_zerakey', token,{
                httpOnly : true,
                secure : false,
                sameSite: "Lax",
                path: '/',
                maxAge : 2 * 60 * 60 * 1000,
            })

            res.status(200).json({
                message : 'Login Successful 🎉',
                status : true,
                user : {
                    username : user.username
            }})
        }   
    }
    catch(error)
    {
        console.log("Error is : ", error)
        res.status(500).json({message : error})
    }
}