import jwt from 'jsonwebtoken'

function authMiddleware(req,res,next){
    const token = req.headers['authorization']?.split(" ")[1]; // Ensure token is extracted correctly
    console.log(token+" inside")
    if (!token){
        res.status(401).json({message : "no token received"})
        return
    }
    jwt.verify(token,process.env.JWT_SECRET ,(err,decoded) => {
        if (err){
            console.log("fucti")
            res.status(401).json({message:"Invalid Token"})
            return
        }
        req.userID = decoded.id 
        console.log("hey");
        next()

    })

}

export default authMiddleware
