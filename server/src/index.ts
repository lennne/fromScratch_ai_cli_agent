import express from "express";
import dotenv from "dotenv";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node"
import { auth } from './lib/auth';
import cors from "cors";

dotenv.config();

// SERVER SETUP
const app = express();
const port = process.env.PORT;

//cors implementation
//this basically means that it should handly only requests from localhost:3000
//we also specify the REST API methods that we need(little security addition)
//and we need credentials when we're accessing the server
app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

//any variable that is not initialized with let,var, or const is considered 
// globally scoped
// this basically tells express to use this middleware for all routes
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json());

// API ROUTES
app.get('/health', (req, res) => {
    res.send("OK");
});

// passing in an async function to respond
app.get("/api/me", async(req, res) => {
    // create session 
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    // return created session as a json
    return res.json(session);
})

app.get("/device", (req, res) => {
    const { user_code } = req.query;

    return res.redirect(`http://localhost:3000/device?user_code=${user_code}`);
});


app.listen(port, () => {
    console.log("Your application is running on port", port)
});