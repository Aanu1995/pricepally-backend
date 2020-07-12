const express = require("express");
require("./database/mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");

var app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

app.listen(port, () => {
  console.log("Server is up on port: " + port);
});
