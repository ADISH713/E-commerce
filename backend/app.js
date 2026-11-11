import express from 'express'
import cors from 'cors'
import productRoutes from "./routes/productRoutes.js"

const app = express()

app.use(express.json())


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/",(req,res)=>{
    res.status(200).json({success:true,message:"TORQUE RC API IS RUNNING",data:null})
})

app.use((req, res) => {res.status(404).json({success: false,message: "Route not found",data: null})})

app.use("/api/products",productRoutes)

export default app