// server.js (Node + Express)

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // for unique IDs
const app = express();

app.use(cors());
app.use(express.json()); // parse JSON in request body

// A simple in-memory store { id: data }
const gradientStore = {};

app.post("/api/storeGradient", (req, res) => {
  const gradientData = req.body.gradientData; // your JSON or XML from Roblox
  if (!gradientData) {
    return res.status(400).json({ error: "No gradient data" });
  }

  // Generate a unique ID
  const gradientId = uuidv4();
  // Store it
  gradientStore[gradientId] = gradientData;

  // Return the ID to Roblox
  return res.json({ id: gradientId });
});

app.get("/api/getGradient/:id", (req, res) => {
  const gradientId = req.params.id;
  const data = gradientStore[gradientId];
  if (!data) {
    return res.status(404).json({ error: "Not found" });
  }
  return res.json({ id: gradientId, gradientData: data });
});

// Serve a basic HTML file (if you want)
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
