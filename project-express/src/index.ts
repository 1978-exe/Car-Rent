import express, { Request,Response } from "express";
import adminRoute from "./routes/adminRoute";
import carRoute from "./routes/carRoute";
import rentRoute from "./routes/rentRoute";

const app = express()
const PORT = 8000

app.use(express.json())

app.use(adminRoute)
app.use(carRoute)
app.use(rentRoute)

app.get('/',(req:Request,res:Response) =>{
    return res.status(200).json({
        message:'Berhasil'
    })
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})