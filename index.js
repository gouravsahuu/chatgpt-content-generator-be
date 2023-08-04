const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4500;

app.use(express.static("public"));

app.get("/generate", async (req, res) => {
    const { contentType, keyword } = req.query;
    console.log(req.query);

    // Call ChatGPT API to generate content
    const apiKey = process.env.openaiapikey;
    const apiUrl = `https://api.openai.com/v1/chat/completions`;
    const prompt = `Generate ${contentType} about ${keyword}`;
    
    try {
        const response = await axios.post(apiUrl, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 100
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });

        const content = response.data.choices[0].message.content;
        res.json({content});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});