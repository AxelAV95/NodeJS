const jwt = require("jsonwebtoken")

const protectAuth = (req, res, next)=>{
    const token = (req.headers.authorization || "").replace(/Bearer\s?/,"")

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.userId = decoded._id

            next()
        }catch(error){
            return res.status(403).json({
                message: "Not Authorized"
            })
        }
    }else{
        return res.status(403).json({
            message: "No token"
        })
    }
}

module.exports = protectAuth