const express = require('express');
const productsRouter = express.Router();
const pool = require('../db');

productsRouter.get('/', async (req, res) => {

    try {
        const products = pool.query('select * from products');
        res.json(products.rows);
    } catch (error) {
        console.error(error.message);
    }
});



module.exports = productRouter;