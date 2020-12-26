const express = require('express');
const pool = require('../db');
const router = expressRouter();

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

router.post('/', async (req, res) => {

})

module.exports = router;