var express = require("express");
const data = require("../../public/data/data");
const Product = require("../models/product")
const {auth, isAdmin} = require("../middleware/auth")

var router = express.Router();

/* GET list of products */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.post("/", auth, isAdmin, async (req, res) => {
    try {
        const product = Product(req.body);
        await product.save()
        res.status(201).send(product)
    } catch (error) {
        res.status(400).send({error: error.message});
    }
})

router.patch("/:id", auth, isAdmin, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "name",
        "description",
        "image",
        "brand",
        "price",
        "category",
        "countInStock",
        "rating",
        "numReviews",
        "reviews",
    ];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (! isValidOperation) {
        return res.status(404).send({error: "Invalid updates"});
    }

    try {
        const _id = req.params.id;
        const product = await Product.findOne({_id})
        if (! product) {
            return res.status(404).send({error: "product doesn't exist"})
        }
        updates.forEach((update) => product[update] = req.body[update]);
        await product.save();

        res.send(product);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.delete("/:id", auth, isAdmin, async (req, res) => {
    try {
        const _id = req.params.id;
        const product = await Product.findOneAndDelete({_id});
        if (! product) {
            return res.status(404).send("product doesn't exist")
        }
        return res.send({message: "success"})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

module.exports = router;
