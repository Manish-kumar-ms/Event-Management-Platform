import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userModel } from '../Models/userModel.js'

// import { userModel } from '../Models/userModel.js'

export const signup=async(req,res)=>{
   try{
    const {name,email,password,role}=req.body
       
    if(!name || !email || !password || !role ){
        return res.status(400)
        .json({message:"something is  missing in email,password or role",
            success: false
        })
    }
      
    const user=await userModel.findOne({email})
    if(user){
        return res.status(400)
        .json({message:`already exist`,
            success:false
        })
    }

    const hashedpassword= await bcrypt.hash(password,10)

  const newuser=  await userModel.create({
        email,
        password:hashedpassword,
       role,
       name,
       
    })

    return res.status(201)
    .json({message:"account is created",
        success: true,
        newuser
    })
}
    catch (error) {
        console.log(error)
        return res.status(400)
        .json({message:"there is some problem on registartion",
            success: false
        })
        
    }

}


 export const login= async (req,res)=>{
    try{
       const{email,password,role}=req.body
      
       
      if(role === "Guest"){
        try{

            const expirationTime = new Date(Date.now() + 3600 * 1000); // 1 hour from now

            const guestuser=await userModel.create({
                
                role:"Guest",
                IsGuest:true,
                expiresAt: expirationTime,
            })
            console.log(guestuser.IsGuest)

          const jwttoken=jwt.sign(
            {_id: guestuser._id, Isguest:true},
              process.env.JWT_SECRET,
              {expiresIn :'1h'}
          )

          return res.status(200).json({
            message: "Login successful",
            success:true,
            jwttoken,
            guestuser
         });

        }catch(error){
            console.error("Error in guest login:", error);
           return res.status(500).json({ message: "Error in guest login", error });
          }
      }

      else{
        try {
            if(!email || !password || !role){
                return res.status(400)
                .json({message:"something is  missing in email,password and role",
                    success: false
                })
            }

            const user=await userModel.findOne({email,role})
            if(!user){
                return res.status(403)
                .json({message:"user not found ",
                    success: false
                })
            }

            const isequal= await bcrypt.compare(password, user.password)
            if(!isequal){
                return res.status(403)
                .json ({message :"user and password is wrong",success:false})
              }
            
             

              const jwtToken=jwt.sign(
                {email:user.email, _id:user._id},
                process.env.JWT_SECRET,
                   {expiresIn :'24h'}
           
               )
               
               return res.status(201)
               .json({
                   message:"login sucess",
                   success: true,
                   jwtToken,
                   email,
                   IsGuest: false,
                      
               })
               

            
        } catch (error) {
            console.log(error)
            return res.status(400)
            .json({message:"there is some problem on login",
                success: false
            })
        }
      }

    }catch(error){
        console.log(error)
    return res.status(400)
    .json({message:"there is some problem on login",
        success: false
    })
    }



 }