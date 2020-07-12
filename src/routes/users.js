const express = require("express");
const User = require("../models/user");

const router = express.Router();

/* GET All users */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

/* POST  register user */
router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    return res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

module.exports = router;
