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

router.post('/:orderId', async (req, res) => {
    try {

        const {product_id, quantity, total} = req.body;
        const orderDetails = await pool.query('insert into order_details (order_id, product_id, quantity, total) values ($1, $2, $3, $4) returning *', [req.id, product_id, quantity, total]);
        res.json(orderDetails);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;