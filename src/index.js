const express = require("express");

const app = express();

//localhost:3333
app.get("/", (request, response) => {
  return response.json({message: 'Hello, world! Ignite - Fundamentos Nodejs!'});
})

app.listen(3333)