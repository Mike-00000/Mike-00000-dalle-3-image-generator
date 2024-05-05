import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { config, uploader } from "cloudinary";
import OpenAI from "openai";


const app = express();
const PORT = 9000;

// 
//!Configure openai
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })
//!Cloudinary
config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
//!Middlewares
app.use(express.json())
//!Routes
app.post('/generate-image', async(req, res) => {
    const {prompt} = req.body
try {
    const imageResponse = await openai.images.generate({
        model:"dall-e-3",
        prompt,
        n: 1,
        size:'1024x1024'
    });
    // Save the image into cloudinary
    res.json(imageResponse.data[0].url);
} catch (error) {
    res.json({ message: "Error generating image "})
}
})
//!Start the server
app.listen(PORT, console.log("Server is running..."))