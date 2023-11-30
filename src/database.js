import mongoose from 'mongoose'
import { MONGO_URI } from './config'

export const getConnection = async ()=>{
    try {
        const db = await mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,   
            useUnifiedTopology:true    

        })
        console.log("conected to:", db.connection.name)
    } catch (error) {
        console.log(error.message)
    }
} 

