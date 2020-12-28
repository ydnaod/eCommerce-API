const express = require('express');
const pool = require('../db');
const router = express.Router();

router.param('orderId', async (req, res, next, id) => {

    try {
        const order = await pool.query('select * from orders where order_id = $1', [req.params.orderId]);
        if(order.rows.length ==0){
            res.status(404).json('oops order not found');
        }
        req.id = req.params.orderId;
        next();
    } catch (error) {
        console.error(error.message);
    }

})

router.param('orderDetailsId', async (req, res, next, id) => {

    try {
        const order = await pool.query('select * from orders where order_details_id = $1', [req.params.orderDetailsId]);
        if(order.rows.length ==0){
            res.status(404).json('oops order not found');
        }
        req.details_id = req.params.orderDetailsId;
        next();
    } catch (error) {
        console.error(error.message);
    }

})

router.post('/:orderId', async (req, res) => {
    try {
        const {product_id, quantity, total} = req.body;
        const orderDetails = await pool.query('insert into order_details (order_id, product_id, quantity, total) values ($1, $2, $3, $4) returning *', [req.id, product_id, quantity, total]);
        res.json(orderDetails);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:orderId', async (req, res) => {
    try {
        const order = await pool.query('select * from order_details where order_id = $1', [req.params.orderId]);
        res.json(order.rows);
    } catch (error) {
        console.error(error.message);
    }
})

router.delete('/:orderDetailsId', async (req, res) => {
    try {
        const deletedItem = await pool.query('delete from order_details where order_details_id=$1', [req.details_id]);
        res.json(deletedItem.rows);
    } catch (error) {
        console.error(error.message);
    }
})

router.put('/:orderDetailsId', async (req, res) => {
    try {
        const {product_id, quantity, total} = req.body;
        const updatedItem = await pool.query('update order_details set quantity = $1, total=$2 where order_details_id = $3 and product_id = $4', [quantity, total, req.details_id, product_id])
    } catch (error) {
        console.error(error.message);
    }
})

router.post('/:orderId/checkout', async (req, res) => {
    try {
        const order = await pool.query('select order_details.order_id, order_details.quantity, products.name, products.price from order_details inner join orders on order_details.order_id = orders.order_id inner join products on products.id = order_details.product_id where order_details.order_id = $1;', [req.params.orderId]);
        let total = 0;
        const calculateTotal = await order.rows.forEach( row => total += (row.quantity * Number(row.price.replace(/[^0-9\.-]+/g,""))));
        total = '$' + total.toFixed(2).toString();
        order.rows[order.rows.length] = {total};
        order.total = {total};
        res.json(order.rows);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;