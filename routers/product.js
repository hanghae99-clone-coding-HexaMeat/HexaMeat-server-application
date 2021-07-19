const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');
const auth = require('../middlewares/auth-Middleware');

router.get('/', async (req, res) => {
    const result = [];
    const pork = await Product.find({ category: '돼지' }).limit(6);
    const beef = await Product.find({ category: '소' }).limit(6);
    const checken = await Product.find({ category: '닭' }).limit(6);

    result.concat(pork, beef, checken);

    res.status(200).send({ result });

    // if ( category === 'all') {
    //     const result = await Product.find()
    //     res.status(200).json(result);
    // }
    // else {
    //     const result = await Product.find({ category })
    //     res.status(200).json(result);
    // }
});
// result 로 주는게 편한가 ? 아니면 일일이 쪼개서 주는게 편한가 ?
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
