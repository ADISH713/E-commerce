
import express from 'express'
import cors from 'cors'
import productRoutes from "./routes/productRoutes.js"
import errorMiddleware from './middleware/errorMiddleware.js'
import notFoundMiddleware from './middleware/notFoundMiddleware.js'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
import MESSAGES from './constants/messages.js'
import paymentRoutes from "./routes/paymentRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import helmet from 'helmet'
import { apiLimiter } from './middleware/rateLimiters.js'

const app = express()

// behind a proxy (Render, Railway, Nginx) the real client IP comes from the proxy header
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1)
}

app.use(helmet())

app.use(express.json({ limit: "10kb" }))

app.use(cookieParser())

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

app.use("/api", apiLimiter)

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: MESSAGES.COMMON.API_RUNNING,
        data: null
    })
})

app.use("/api/auth",authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api", reviewRoutes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
