const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');
const auth = require('../middlewares/auth-Middleware');

router.get('/', async (req, res) => {
    // const results = JSON;
    // results.pork = await Product.find({ category: '돼지' }).limit(6);
    // results.beef = await Product.find({ category: '소' }).limit(6);
    // results.checken = await Product.find({ category: '닭' }).limit(6);

    const result = []
    const pork = await Product.find({ category: '돼지' }).limit(6);
    const beef = await Product.find({ category: '소' }).limit(6);
    const checken = await Product.find({ category: '닭' }).limit(6);

    
    pork.forEach(p => {
        result.push(p)
    })
    beef.forEach(b => {
        result.push(b)
    });
    checken.forEach(c => {
        result.push(c)
    });
    console.log(result)
    res.status(200).send({ result });

});

router.get('/detail', async (req, res) => {
    try {
        const { productId } = req.query;
        const result = await Product.findOne({ _id: productId });
        res.send({ result });
    } catch (error) {
        res.status(401).send({ errorMessage: '올바르지 않은 접근' });
    }
});

module.exports = router;
