// necessary imports
const express = require("express");
const getToDos = require("./utils/getTodos");
const redisToDoCache = require("./middleware/redisToDoCache");
const getUserByUserName = require("./utils/getUserByUserName");
const redisUserCache = require("./middleware/redisUserCache");

// initialize app
const app = express();

// defining port
const port = process.env.PORT || 5000;

// getting home("/") route
app.get("/", (req, res) => {
  res.send("Server is Running successfully!");
});

// getting toDos("/todo-data") route
app.get("/todo-data", redisToDoCache, getToDos);
app.get("/users/:username", redisUserCache, getUserByUserName);

// listening app here
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
