import jwt from "jsonwebtoken";

function verifyJWT (req,res,next){

        const header = req.header("authorization");
        if(header != null){
            const token = header.replace("Bearer ","")
            console.log(token);
            jwt.verify(token,"random456",(err , decoded)=>{
                console.log(decoded);
                if(decoded != null){
                    req.user = decoded;
                }
            })
        }
        next()
    }
export default verifyJWT;
