const express = require('express');
const productsRouter = express.Router();
const pool = require('../db');

productsRouter.param('productId', async (req, res, next, id) => {
    const products = await pool.query('select * from products');
    const productIndex = products.rows.findIndex(product => product.product_id == id);

    if(productIndex !== -1){
        req.oroductIndex = productIndex;
        req.id = id;
        next();
    }
    else{
        res.status(404).send('oops product not found');
    }
})

productsRouter.get('/', async (req, res) => {

    try {
        const products = await pool.query('select * from products');
        res.json(products.rows);
    } catch (error) {
        console.error(error.message);
    }
});

productsRouter.get('/:productId', async (req, res) => {
    try {
        const product = await pool.query('select * from products where product_id=$1', [req.id]);
        res.json(product.rows);
    } catch (error) {
        console.error(error.message);
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const {price, name, description} = req.body;
        const newProduct = await pool.query('insert into products (price, name, description) values ($1, $2, $3) returning *', [price, name, description]);
        res.json(newProduct.rows);
    } catch (error) {
        console.error(error.message);
    }
});

productsRouter.put('/:productId', async (req, res) => {
    try {
        const {price, name, description} = req.body;
        const updatedProduct = await pool.query('update products set price=$1, name=$2, description=$3 where product_id=$4 returning *', [price, name, description, req.id]);
        res.json(updatedProduct.rows);
    } catch (error) {
        console.error(error.message);
    }
});

productsRouter.delete('/:productId', async (req, res) => {
    try {
        const deletedProduct = await pool.query('delete from products where product_id=$1', [req.id]);
        res.json(deletedProduct.rows);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = productsRouter;