const axios = require("axios");
const client = require("./connect");

const getUserByUserName = async (req, res, next) => {
  try {
    console.log("Fetching user by Username...");

    // get username from params
    const { username } = req.params;
    const newUserName = processUsername(username);
    const key = `user:${newUserName}`;

    // Fetch from external API if not cached:
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    if (!response.data) {
      throw new Error(`Failed to fetch users. Status: ${response.status}`);
    }
    const users = await response.data;
    if (!Array.isArray(users)) {
      throw new Error("Invalid response format. Expected an array.");
    }
    // search user by username
    const user = users.find((user) => user.username === newUserName);

    // if username matched then run this logic
    if (user !== null) {
      // set the toDos data in Redis and set expiration time
      await client.set(key, JSON.stringify(user));
      await client.expire(key, 60);
      res
        .status(200)
        .json({ message: "Successfully save user in redis", payload: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
    next();
  }
};

const processUsername = (username) => {
  const parts = username.split("_");
  if (parts.length > 0) {
    const processedUsername = parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("_");
    return processedUsername;
  } else {
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  }
};

module.exports = getUserByUserName;
