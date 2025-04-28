// import Admin from "../models/Admin.js";
const Admin = require("../models/Admin")

// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken');


const protectAdmin = async (req, res , next)=>
{
    try{
        // ?. (optional chaining operator) - Safely checks if authorization exists before proceeding
        // Prevents errors if the header is missing
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        //.select('-password')
        // Modifies the query to EXCLUDE the password field
        // Security best practice - never return passwords to the client
        // The - means "exclude this field"
        req.admin = await Admin.findById(decoded.id).select('-password')

        if(!req.admin)
        {
            throw new Error('Admin not found');
        }
        next();
    }
    catch(error)
    {
        res.status(401);
        throw new Error('Not Authorized as admin ');
    }

}

// export default protectAdmin;
module.exports = protectAdmin;