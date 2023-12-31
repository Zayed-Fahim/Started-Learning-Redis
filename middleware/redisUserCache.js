// necessary imports
const client = require("../utils/connect");

const redisUserCache = async (req, res, next) => {
  try {
    const { username } = req.params;
    const newUserName = processUsername(username);
    const key = `user:${newUserName}`;

    // check if already cached
    const alreadyCached = await client.get(key);
    if (alreadyCached) {
      return res.status(200).json({
        message: "Successful from redis already cached data",
        payload: JSON.parse(alreadyCached),
      });
    }
    // if not cached, you can handle this case or simply return a message
    const user = await client.get(key);
    if (!user) {
      return next();
    } else {
      return res.status(200).json({
        message: "Successful from redis cached data",
        payload: JSON.parse(user),
      });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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

module.exports = redisUserCache;
