import { config } from "dotenv";
config()
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test"
export const SECRET = process.env.SECRET || ""