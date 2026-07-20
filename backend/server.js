import app from "./src/app.js"
import dotenv from "dotenv"
import connectToDB from "./src/config/database.js"
// import generateInterviewReport from "./src/services/ai.service.js"
// import { resume, selfDescription, jobDescription } from "./src/services/temp.js"

dotenv.config()

connectToDB()
// generateInterviewReport({resume, selfDescription, jobDescription})


const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
