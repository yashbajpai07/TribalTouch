// const express=require('express')
import express from 'express'
import colors from 'colors'
import cors from 'cors'

import dotenv from 'dotenv'
//configure env
dotenv.config();//if in any other folder define path inside as config({'path'})
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'


//database config
connectDB();

//rest object
const app=express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)
//rest api
app.get('/',(req,res)=>{
    res.send('<h1>Welcome to Ecom</h1>')
})

//PORT
const PORT=process.env.PORT || 5500; 

//run listen
app.listen(PORT,()=>{
    console.log(`Server running on mode ${process.env.DEV_MODE} on port ${PORT}`.bgCyan.white)
})