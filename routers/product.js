const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const Cart = require('../models/cart')
const auth = require('../middlewares/auth-Middleware')

router.get('/category', async (req,res) => {
    const { category } = req.query

    const result = String
    result.pork = await Product.find({ category:'돼지'}).limit(6)
    result.beef = await Product.find({ category: '소' }).limit(6)
    result.checken = await Product.find({ category: '닭' }).limit(6)
    
    res.status(200).send({ result })

    // if ( category === 'all') {
    //     const result = await Product.find()
    //     res.status(200).json(result);
    // }
    // else {
    //     const result = await Product.find({ category })
    //     res.status(200).json(result);
    // }
})
// result 로 주는게 편한가 ? 아니면 일일이 쪼개서 주는게 편한가 ? 
router.get('/detail', async(req,res) => {
    try {
    
        const { productId } = req.query;
        const result = await Product.findOne({ productId })
        // postDetail = await Post.findOne({ _id: postId });
        res.json(result)
    }


 catch (error) {
    res.status(401).send({ errorMessage : "올바르지 않은 접근" })
}
})

module.exports = router;
