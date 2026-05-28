const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/api/trends", async (req, res) => {
  try {
    const searchTerm = req.query.q;

    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_trends",
        q: searchTerm,
        hl: "en",
        date: "today 12-m",
        tz: "420",
        data_type: "GEO_MAP_0",
        api_key: process.env.SERP_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.log("Backend API error:", error.message);
    res.status(500).json({ error: "Failed to fetch trends data" });
  }
});

app.get("/api/youtubeTrends", async (req, res) => {
  try {
    const searchTerm = req.query.q;

    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_trends",
        q: searchTerm,
        gprop: "youtube",
        hl: "en",
        date: "today 12-m",
        tz: "420",
        data_type: "GEO_MAP_0",
        api_key: process.env.SERP_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.log("Backend API error:", error.message);
    res.status(500).json({ error: "Failed to fetch trends data" });
  }
});


app.get("/", (req, res)=>{
  res.send("TrendFinder backend is running!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });


