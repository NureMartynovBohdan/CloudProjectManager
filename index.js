const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

const uri =
  "mongodb://azure-cosmos-nure:ZyN4qPZnDeCDoxz39zZuSMdiszr4qreGXE6RANz39ACgtFayCZmvqWNfEEKjeABqgdWmXFhODCaNACDbzO79BA==@azure-cosmos-nure.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-cosmos-nure@";

let client;
let database;
let server;

async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    database = client.db("CloudProjectManager");
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to DB: ", e);
  }
}

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    return res.status(400).send("Password must be at least 8 characters");
  }

  const users = database.collection("Users");
  const existingUser = await users.findOne({ username });

  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await users.insertOne({ username, password: hashedPassword });

  res.status(201).send("Registration successful");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = database.collection("Users");
  const user = await users.findOne({ username });

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    res.status(200).send("Login successful");
  } else {
    res.status(401).send("Invalid username or password");
  }
});

if (require.main === module) {
  (async () => {
    await connectDB();
    server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running at port ${port}`);
    });
  })();
}

function closeServer() {
  if (server) {
    server.close();
  }
  if (client) {
    client.close();
  }
}

module.exports = { app, connectDB, closeServer };
