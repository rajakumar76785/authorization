const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res,next) => {
    try{    
           console.log("cookie token", req.cookies.token);
           console.log("body token",req.body.token);
           console.log("header", req.header("Authorization"));
           const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
           if(!token || token == undefined){
              return res.status(401).json({
                success:false,
                message: "token missing",
              });
        }
        try
        {
           const payload =jwt.verify(token,process.env.JWT_SECRET);
           console.log(payload);
           req.user = payload;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"token invalide",
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong while verifying the token ",
        });
    }
}

exports.isStudent = (req,res,next) => {
    try{ 
        if(req.user.role !== 'Student'){
            res.status(401).json({
                success:false,
                message:'this route is protected for student',
            });
        }
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message:"there is something wrong",
        })
    }
}
exports.isAdmin = (req,res,next) => {
    try{ 
        if(req.user.role !== 'Admin'){
            res.status(401).json({
                success:false,
                message:'this route is protected for Admin',
            });
        }
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message:"there is something wrong"
        })
    }
}
