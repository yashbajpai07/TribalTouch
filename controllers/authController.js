import express from 'express';
import userModel from '../models/userModel.js'
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';


//Registration Controller
const registerController=async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer}=req.body
        //validation
        if(!name){
            return res.send({message:"Name is Required"});
        }
        if(!email){
            return res.send({message:"Email is Required"});
        }
        if(!password){
            return res.send({message:"Password is Required"});
        }
        if(!address){
            return res.send({message:"Address is Required"});
        }
        if(!phone){
            return res.send({message:"Phone Number is Required"});
        }
        if(!answer){
            return res.send({message:"Answer is Required"});
        }
        //check user
        const existingUser=await userModel.findOne({email:email})
        //existing user
        if(existingUser)
        {
            return res.status(200).send({
                success:false,
                message:"Already Register Please Login"
            })
        }
        //regsiter user
        const hashedPassword=await hashPassword(password)
        //save
        const user=await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()
        
        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Registration",
            error,
        })
    }
}

//Login Contoller
export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        //validation
        if(!email || !password)
        {
            return res.status(400).send({
                success:false,
                message:"Invalid Email or Password"
            })
        }
        //check user
        const user=await userModel.findOne({email:email})
        if(!user)
        {
            return res.status(404).send({
                success:false,
                message:"Email is not Registered"
            })
        }
        const match=await comparePassword(password,user.password);
        if(!match)
        {
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        //token
        const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.status(200).send({
            success:200,
            message:"User Login Successful",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,

            },
            token
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
}
//forgotPassword
export const forgotPasswordController=async(req,res)=>{
    try {
        const {email,answer,newPassword}=req.body
        if(!email){
            res.status(400).send({message:"Email is required"});
        }
        if(!answer){
            res.status(400).send({message:"Answer is required"});
        }
        if(!newPassword){
            res.status(400).send({message:"New Password is required"});
        }
        //check email and answer
        const user=await userModel.findOne({email,answer})
        //validate
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer"
            })
        }
        const hashed=await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:"Password Changed Successfully",
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went Wrong",
            error
        })
    }
}

//test Controller
export const testController=(req,res)=>{
    res.send("Protected ROute");
}

export default registerController;

