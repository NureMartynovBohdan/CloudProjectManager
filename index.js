const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3000;
const uri =
  "mongodb://azure-cosmos-nure:ZyN4qPZnDeCDoxz39zZuSMdiszr4qreGXE6RANz39ACgtFayCZmvqWNfEEKjeABqgdWmXFhODCaNACDbzO79BA==@azure-cosmos-nure.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-cosmos-nure@";
const client = new MongoClient(uri);

app.use(express.json());

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Database connection error:", e);
  }
}

connectDB();

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || password.length < 8) {
      return res.status(400).send("Invalid username or password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client
      .db("CloudProjectManager")
      .collection("Users")
      .insertOne({ username, password: hashedPassword });
    res.status(201).send(`User registered with id: ${result.insertedId}`);
  } catch (e) {
    console.error("Error registering user:", e);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await client
      .db("CloudProjectManager")
      .collection("Users")
      .findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid username or password");
    }
    res.send("Login successful");
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at port ${port}`);
});
