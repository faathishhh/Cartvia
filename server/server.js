import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import cookieParser from 'cookie-parser'
import cors from "cors"




//to access .env variables
dotenv.config()



const app = express();


//to convert json data into original form
app.use(express.json());

//it allows your frontend application to communicate with your backend when they run on different origins.
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true
}));
//to access cookies
app.use(cookieParser())

//establishing mongodb connection
connectDB()


//register routes
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);



app.listen(5000, () => {
    console.log("server is running on port 5000");
});