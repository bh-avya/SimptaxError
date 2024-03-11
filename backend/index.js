//imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//Utilities
import connectDB from "./config/db.js";

//PORT
dotenv.config()
const port  = process.env.PORT;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.send("Hello world");
})

app.listen(port, ()=>{
    console.log(`Listening to server on : http://localhost:${port}`)
})
