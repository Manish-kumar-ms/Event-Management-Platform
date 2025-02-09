import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongo_url = process.env.MONGODB_URL;

export const connectDB=()=>{
      mongoose.connect(mongo_url)
      .then(()=>{
        console.log("mongoDB connect")
      })
      .catch((err)=>{
        console.log(err)
      })
}