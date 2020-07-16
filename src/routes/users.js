const express = require("express");
const User = require("../models/user");
const {auth, isAdmin} = require("../middleware/auth");

const router = express.Router();

/* GET All users */
router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find({isAdmin: false});
        res.send(users);
    } catch (error) {
        res.status(401).send({error: error.message});
    }
});

router.get("/admins", auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({isAdmin: true});
        res.send(users);
    } catch (error) {
        res.status(401).send({error: error.message});
    }
});

/* POST  register user */
router.post("/register", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(401).send({error: error.message});
    }
});

/* LogOut Users */
router.post("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
        await req.user.save()
        res.send({message: "success"})
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})


router.post("/createadmin", async (req, res) => { // please make sure you attach verify key to the body to create admin
    try {
        if (req.body.verify != process.env.VERIFY_KEY || req.body.isAdmin != true) {
            throw new Error("You are not authorized to perform the request")
        }

        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user, token});

    } catch (error) {
        res.status(401).send({error: error.message})
    }
})

module.exports = router;
