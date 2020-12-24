const express = require('express');
const usersRouter = express.Router();
const pool = require('../db');


//Get User
usersRouter.get('/', async (req, res) => {
    try {
        const users = await pool.query('select * from users');
        res.send(users);
    } catch (error) {
        console.error(err.message);
    }
})

//Create User
usersRouter.post('/', async (req, res) => {
    try {
        const { user_name } = req.body;
        console.log(user_name);
        const newUser = await pool.query('INSERT INTO users (user_name) VALUES($1) returning *', [user_name]);
        res.json(newUser);
    } catch (error) {
        console.error(err.message);
    }
})

//Update User

//Delete User

module.exports = usersRouter;