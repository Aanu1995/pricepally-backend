var express = require("express");
const data = require("../../public/data/data");

var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.send(data.products);
});

module.exports = router;
