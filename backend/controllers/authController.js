const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middlewares/catchAsyncErrors');
const sendToken = require('./jwtToken');
const sendEmail = require('../utils/jwtToken/sendEmail')

//Register a user => /api/v1/register
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const{name,email,password}=req.body;

    const user=await User.create({
        name,
        email,
        pasoword,
        avatar:{
            public_id:'link'
        }
    })
    //30
    sendToken(user,200,res)
})

//login user => /a[i/v1/login
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const{email,password}=req.body;

    if(!email||!password){
        return next(new ErrorHandler('Please enter email & password',400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalid Email and password',401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or Password',401))
    }

     sendToken(user,200,res)
})

exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password',404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave:false })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendEMail({
            email:user.email,
            subject:'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to: ${user.email}`
        })
        
    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPaswwordExpire = undefined;

        await user.save({ validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500))
    }


})

exports.logout = catchAsyncErrors(async (req,res,next)=>{
    res.cookies('token',null, {
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'Logout out'
    })
})