const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {login,signup} = require('../Controllers/Auth');
const {auth,isStudent,isAdmin} = require('../middleware/Auth');
router.post('/login',login);
router.post('/signup',signup);

//protected routes creating
router.get('/test',auth,(req,res)=>{
        res.status(200).json({
            success:true,
            message:"welcome to protected route for test",
        });
});
router.get('/student',auth,isStudent,(req,res)=>{
        res.status(200).json({
            success:true,
            message: "welcome to protected route of student",
        });
});
router.get('/admin',auth,isAdmin,(req,res)=>{
        res.status(200).json({
          success:true,
          message: 'welcome to protected route of admin',
        });
});
router.get('/getEmail',auth,async(req,res)=>{
    const id = req.user.id;
    const user = await User.findById(id);

    console.log(user.email);
    res.status(200).json({
        success:true,
        id:id,
        message:"this is protected route for email",
    })
})
module.exports = router;