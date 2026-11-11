import connectDB from './config/db.js'
import "dotenv/config"
import app from './app.js'


const startServer = async () => {
    try{
    await connectDB()
    const PORT = process.env.PORT || 5000
    app.listen(PORT,()=>{
        console.log("Server is running on:",PORT)
    })
}
catch(error){
    console.log("Server startup failed")
    process.exit(1);
}
}
startServer()