// necessary imports
const client = require("./connect");
const axios = require("axios").default;

const getToDos = async (req, res, next) => {
  try {
    console.log("Fetching toDos...");

    // get the toDos data from the API endpoint
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );

    // get the toDos data here
    const toDos = await response.data;

    // if toDos data is available
    if (toDos !== null) {
      // set the toDos data in Redis and set expiration time
      await client.set("toDos", JSON.stringify(toDos));
      await client.expire("toDos", 60);
      return res.status(200).json({
        message: "Successful save to redis",
        payload: toDos,
      });
    }
    res
      .status(200)
      .json({ message: "Successful get from api", payload: toDos });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
    next();
  }
};

module.exports = getToDos;
