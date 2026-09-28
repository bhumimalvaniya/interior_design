import dotenv from "dotenv";//npm i dotenv
dotenv.config();

import mongoose from "mongoose";//npm i mongoose 
import express from "express";//npm i express mongoose

import cors from "cors";
import path from "path";

import adminRouter from "./Router/AdminRouter.js";
import userRouter from "./Router/UserRouter.js";
import projectRouter from "./Router/ProjectRouter.js";
import gallaryRouter from "./Router/GalleryRouter.js";
import categoryRouter from "./Router/CategoryRouter.js";
import eventRouter from "./Router/EventRouter.js";
import contactRouter from "./Router/ContactRouter.js";
import serviceRouter from "./Router/ServiseRouter.js";
import consultationRouter from "./Router/ConsultationRouter.js";
import headerMenuRouter from "./Router/HeaderMenuRouter.js";

const app=express();

app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(process.cwd(), "public/uploads")));

app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/cust", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/gallary",gallaryRouter);
app.use("/api/v1/category",categoryRouter);
app.use("/api/v1/event",eventRouter);
app.use("/api/v1/contact",contactRouter);
app.use("/api/v1/services",serviceRouter);
app.use("/api/v1/consultation",consultationRouter);
app.use("/api/v1/header-menu", headerMenuRouter);

const PORT=process.env.PORT;
const MONGOURL=process.env.MONGOURL;


mongoose.connect(MONGOURL)
    .then(()=>{
        console.log("database connected successfully");
        //added
        app.get("/", (req, res) => {
   res.send("Backend API is running successfully 🚀");
});
        
app.listen(PORT,()=>{
            console.log(`server is running on portion : ${PORT}`)
        })
    })
    .catch((error)=>console.log(error))