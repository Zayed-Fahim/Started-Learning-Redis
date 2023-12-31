const Redis = require("ioredis");

// crate redis connection
const client = new Redis();

// export redis connection
module.exports = client;
