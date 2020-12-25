const dashboardRouter = require('express').Router();
const authorization = require('../middleware/authorization');
const pool = require('../db');

dashboardRouter.get('/', authorization, async (req, res) => {
    try {
        const user = await pool.query('select user_name from users where user_id = $1', [req.user]);
        res.json(user.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('server error');
    }
})

module.exports = dashboardRouter;