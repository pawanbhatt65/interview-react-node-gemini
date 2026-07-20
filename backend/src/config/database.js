import mongoose from "mongoose";

const mongo_uri = process.env.MONGO_URI

async function connectToDB() {
    try {
        await mongoose.connect(mongo_uri)
        console.log("DB has been connected.")
    } catch (error) {
        console.log("src > config > database.js connectToDB catch error: ", error)
    }
}

export default connectToDB