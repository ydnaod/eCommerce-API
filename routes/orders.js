const express = require('express');
const router = express.Router();
const pool = require('../db');

router.param('orderId', async (req, res, next, id) => {
    try {
        const order = await pool.query('select * from orders where order_id = $1', [req.params.id]);
        if(order.rows.length == 0){
            return res.status(404).send('oops not found');
        }
        req.id = req.params.id;
        next();
    } catch (error) {
        console.error(error.message);
    }
})

router.post('/', async (req, res) => {
    try {
        const { user_id, active } = req.body;
        const user = await pool.query('select * from users where user_id = $1', [user_id]);
        if(user.rows.length == 0){
            return res.status(404).json('user does not exist');
        }
        const activeOrder = await pool.query('select * from orders where active = true and user_id=$1', [user_id]);
        if(activeOrder.rows.length !== 0){
           return res.status(400).json('theres already an active order');
        }
        //pool.query('update orders set active = true where active = false');
        const newOrder = await pool.query('insert into orders (user_id, active) values ($1, $2)', [user_id, true]);
        res.json(newOrder.rows);
    } catch (error) {
        console.error(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const orders = await pool.query('select * from orders');
        res.json(orders.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:orderId', async (req, res,next) => {
    try {
        const order = await pool.query ('select * from orders where order_id = $1', [req.id]);
        res.json(order.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.put('/:orderId', async (req, res) => {
    try {
        const updateOrder = await pool.query('update orders set active = $1', [false]);
    } catch (error) {
        console.error(error.message);
    }
});

router.delete('/:orderId', async (req, res) => {
    try {
        const deletedOrder = await pool.query('delete from orders where order_id = $1', [req.id]);
        res.json(deletedOrder.rows);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;