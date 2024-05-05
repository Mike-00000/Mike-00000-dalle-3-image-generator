import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { config, uploader } from "cloudinary";
import OpenAI from "openai";
// mongodb+srv://mtmailmt:SzLqYiu02L1bihJA@ai-art-work.vnqcsdy.mongodb.net/?retryWrites=true&w=majority&appName=ai-art-work

const app = express();
const PORT = 9000;

//!Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() =>{
        console.log('Mongodb connected');
    })
    .catch((e) => console.log(e));

    //!---Gallery model---
    const gallerySchema = new mongoose.Schema(
        {
            prompt: String,
            url: String,
            public_id: String,
        },
        {
            timestamps: true,
        }
);
const Gallery = mongoose.model('Gallery', gallerySchema);
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
    const image = await uploader.upload(
        imageResponse.data[0].url, { 
            folder:'ai-art-work',
        }
    );
    // Save into mongodb
    const imageCreated = await Gallery.create({
        prompt:imageResponse.data[0].revised_prompt,
        url: imageResponse.data[0].url,
        public_id: image.public_id,
    });
    res.json(imageCreated);
} catch (error) {
    res.json({ message: "Error generating image "})
}
});

//!List images route
app.get('/images', async(req, res) => {
    try {
        const images = await Gallery.findOneAndDelete();
        res.json(images);
    } catch (error) {
      res.json({ message: "Error fetching images" })  
    }
})
//!Start the server
app.listen(PORT, console.log("Server is running..."))