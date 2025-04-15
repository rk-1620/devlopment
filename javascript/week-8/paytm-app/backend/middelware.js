
import jwt from "jsonwebtoken";
import { JWT_secret } from "./config";
const authmiddleware = async (req,res,next)=>{

    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];

    if(!token){
        res.json({message:"token not provided"});
    }

    const decode = jwt.verify(jwtToken, JWT_secret);
    if(decode.userId)
    {
        req.userId = decode.userId;
        next();
    }
    else{
        res.json({message:"invalid credentials"});
    }

    

}

export default authmiddleware;