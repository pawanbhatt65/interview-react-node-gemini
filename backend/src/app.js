// global imports
import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    // origin: "http://localhost:5173",
    origin: "https://interview-react-node-gemini.vercel.app",
    credentials: true,
}))
app.use(express.json())


// internal routes import
import authRouter from "./routes/auth.route.js"
import interviewRouter from "./routes/interview.route.js"


// app.use("/", (req, res) => {
//     res.send("Hello world.");
// });

// auth routes
app.use("/api/auth", authRouter);

// interview routes
app.use("/api/interview", interviewRouter);

export default app;