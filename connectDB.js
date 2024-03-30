import mongoose from "mongoose"
const url = "mongodb://127.0.0.1:27017/users"

mongoose.connect(url)
    .then(() => {
        console.log("Connected to mongoDB")
    })