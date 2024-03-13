//imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import connectDB from "./config/db.js";

//PORT
dotenv.config()
const port  = process.env.PORT;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);

app.listen(port, ()=>{
    console.log(`Listening to server on : http://localhost:${port}`)
})
