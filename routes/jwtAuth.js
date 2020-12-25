const express = require('express');
const jwtAuthRouter = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('./utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');

jwtAuthRouter.post('/register', validInfo, async (req, res, next) => {
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

            const token = jwtGenerator(newUser.rows[0].user_id);
            res.json({token});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('oops server error');
    }
});

jwtAuthRouter.post('/login', validInfo, async (req, res, next) => {
    try {
        const { user_email, user_password } = req.body;
        const user = await pool.query('SELECT * from users where user_email = $1', [user_email]);
        if (user.rows.length === 0) {
           return res.status(401).send('email or password is incorrect');
        }
        else {

            const validPassword = await bcrypt.compare(user_password, user.rows[0].user_password);
            console.log(validPassword);

            if(!validPassword){
                return res.status(401).send('email or password is incorrect');
            }
            const token = jwtGenerator(user.rows[0].user_id);
            res.json({token});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('oops server error');
    }
});

module.exports = jwtAuthRouter;