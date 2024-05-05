const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

const uri =
  "mongodb://azure-cosmos-nure:ZyN4qPZnDeCDoxz39zZuSMdiszr4qreGXE6RANz39ACgtFayCZmvqWNfEEKjeABqgdWmXFhODCaNACDbzO79BA==@azure-cosmos-nure.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-cosmos-nure@";

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectDB() {
  try {
    await client.connect();
    console.log("Подключено к MongoDB");

    const database = client.db("CloudProjectManager");
    const users = database.collection("Users");

    const newUser = {
      user_id: new ObjectId(),
      name: "John Doe",
      email: "john@example.com",
      role: "Project Manager",
    };

    const result = await users.insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
  } catch (e) {
    console.error("Ошибка подключения к БД: ", e);
  }
}

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Cloud Project Manager!");
});

app.get("/user/:id", async (req, res) => {
  try {
    const database = client.db("CloudProjectManager");
    const users = database.collection("Users");

    const user = await users.findOne({ user_id: new ObjectId(req.params.id) });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User не найден");
    }
  } catch (e) {
    res.status(500).send("Ошибка подключения к БД: " + e);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
