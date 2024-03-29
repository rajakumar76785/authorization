const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { options } = require("../routes/user");

require("dotenv").config();


exports.signup = async(req,res) => {
    try{
           const {name,email,password,role} = req.body;
           const existinguser = await User.findOne({email});
           if(existinguser){
               res.status(400).json({
                    success: false,
                    message: "user already exist"
               });
           }
           let hashedpassword;
           try{
               hashedpassword = await bcrypt.hash(password,10);
           }
           catch(error){
               return res.status(500).json({
                     success: false,
                     message: "error in hashing password"
               });
           }
           const user = await User.create({
            name,email,password:hashedpassword,role
           })
           return res.status(200).json({
            success:true,
            message:"user created successfully",
           });              
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User can not be registered please try again later',
        });
    }
}

exports.login = async (req,res)=>{
    try{
            const{email,password} = req.body;
            if(!email || !password){
                res.status(400).json({
                    success:false,
                    message:'please fill all the details carefully',
                });
            }
            let user = await User.findOne({email});
            if(!user){
                console.log("user does not exist");
                res.status(400).json({
                    success:false,
                    message:'user is not registerd'
                });
            }
            const payload = {
                email: user.email,
                id:user._id,
                role: user.role,
            }
            if(await bcrypt.compare(password,user.password)){
                const token = jwt.sign(payload,process.env.JWT_SECRET,{
                    expiresIn:"2h",
                });
                user = user.toObject();
                user.token = token;
                user.password = undefined;
                const options = {
                    expiresIn: new Date(Date.now()+ 3*24*60*60*1000),
                    httpOnly:true,
                }
                // res.cookie("token",token,options).status(200).json({
                //     success:true,
                //     token,
                //     user,
                //     message:"user logged in successfull"
                // });
                res.status(200).json({
                    success:true,
                    token,
                    user,
                    message:"user logged in successfull"
                });
            }
            else{
                console.log("password is not correct");
                res.status(400).json({
                    status:false,
                    message:"password is not correcct"
                });
            }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "log in failure",
        });
    }
}
