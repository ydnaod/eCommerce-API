const express = require('express');
const jwtAuthRouter = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

jwtAuthRouter.post('/register', async (req, res, next) => {
    try {
        const { user_name, user_email, user_password } = req.body;
        const user = await pool.query('SELECT * from users where user_email = $1', [user_email]);
        if (user.rows.length !== 0) {
            res.status(400).send('this email is already registered');
        }
        else {

            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);

            const bcryptPassword = await bcrypt.hash(user_password, salt);

            const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES($1, $2, $3) returning *', [user_name, user_email, bcryptPassword]);
            res.json(newUser);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('oops server error');
    }
});

module.exports = jwtAuthRouter;