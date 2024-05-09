import React, { useState } from 'react'
import axios from 'axios'
import {useMutation} from '@tanstack/react-query';
import "./GenerateImage.css";
import Images from './Images';

//! Function to call the backend api (local)
// const GenerateImageAPI = async(prompt) => {
//     const res = await axios.post('http://localhost:9000/generate-image',{prompt})
//     return res.data
// }

//! Function to call the backend api (deployed)
const backendURL = 'https://image-generator-backend.netlify.app';

const GenerateImageAPI = async(prompt) => {
    const res = await axios.post(`${backendURL}/generate-image`, { prompt });
    return res.data;
}

const GenerateImage = () => {
    const [prompt, setPrompt] = useState('')

    //!mutation
    const mutation = useMutation({
        mutationFn: GenerateImageAPI,
        mutationKey: ['dalle']
    })

    //! submit handle
    const handleGenerateImage = () => {
        if (!prompt) {
            alert("Please enter a prompt");
            return;
        };
        mutation.mutate(prompt);
    };

    console.log(mutation);

    return (
        <>
          <div className="header">
            <h1 className="title">AI Image Generator using Dalle 3 from OpenAI</h1>
            <p className="description">
              Enter a prompt in the input field below to generate a unique image
              using AI.
            </p>
            <p>{mutation.isError && mutation.error.message}</p>
          </div>
          <div className="container">
            <input
              type="text"
              placeholder="Enter prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-prompt"
            />
            <button
              onClick={handleGenerateImage}
              disabled={mutation.isLoading}
              className="generate-btn"
            >
              {mutation.isPending ? "Generating..." : "Generate Image"}
            </button>
            {mutation.isSuccess && (
              <div className="image-container">
                <img src={mutation.data.url} alt="Generated" />
              </div>
            )}
          </div>
          <Images />
        </>
      );
    };
    
    export default GenerateImage;