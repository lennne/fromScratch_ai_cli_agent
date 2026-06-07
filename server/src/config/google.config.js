import dotenv from "dotenv";
dotenv.config();

export const config = {
    googleAPIKey : process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    model : process.env.ORBITAL_MODEL || "gemini-2.5-flash"
}