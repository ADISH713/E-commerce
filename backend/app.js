
import express from 'express'
import cors from 'cors'
import productRoutes from "./routes/productRoutes.js"
import errorMiddleware from './middleware/errorMiddleware.js'
import notFoundMiddleware from './middleware/notFoundMiddleware.js'
import { cookie } from 'express-validator'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoutes.js"

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TORQUE RC API IS RUNNING",
        data: null
    })
})

app.use("/api/auth",authRoutes)
app.use("/api/products", productRoutes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
