import jwt from 'jsonwebtoken'

export const ensureAuthentication=(req,res,next)=>{
    const auth=req.headers['authorization']
    if(!auth){
        return res.status(403)
        .json({message:"unauthorized, jWt tokken is required"})
    }

    try {
        const decode=jwt.verify(auth,process.env.JWT_SECRET)
        req.user=decode
        next()
        
    } catch (error) {
        return res.status(400)
        .json({message:"unauthorized, jWt tokken is expired or wrong"})
    }
}  