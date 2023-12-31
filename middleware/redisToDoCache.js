// necessary imports
const client = require("../utils/connect");

const redisToDoCache = async (req, res, next) => {
  try {
    // check if already cached
    const alreadyCached = await client.get("toDos");

    if (alreadyCached) {
      return res.status(200).json({
        message: "Successful from redis already cached data",
        payload: JSON.parse(alreadyCached),
      });
    }
    // if not cached, you can handle this case or simply return a message
    const toDos = await client.get("toDos");
    if (!toDos) {
      return next();
    } else {
      return res
        .status(200)
        .json({
          message: "Successful from redis cached data",
          payload: JSON.parse(toDos),
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

module.exports = redisToDoCache;
