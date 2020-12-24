const express = require('express');
const usersRouter = express.Router();
const pool = require('../db');

//Params
usersRouter.param('userId', async (req, res, next, id) => {
    const users = await pool.query('select * from users');
    const userIndex = users.rows.findIndex(user => user.user_id == id);
    console.log(userIndex);
    if(userIndex !== -1){
        req.userIndex = userIndex;
        req.id = id;
        next();
    }
    else{
        res.status(404).send('oops not found');
    }
});

//Get User
usersRouter.get('/', async (req, res) => {
    try {
        const users = await pool.query('select * from users');
        console.log(users.rows);
        res.send(users);
    } catch (error) {
        console.error(err.message);
    }
});

usersRouter.get('/:userId', async (req, res) => {
    try {
        const user = await pool.query('select * from users where user_id = $1', [req.id]);
        res.send(user);
    } catch (error) {
        console.error(err.message);
    }
});

//Create User
usersRouter.post('/', async (req, res) => {
    try {
        const { user_name } = req.body;
        const newUser = await pool.query('INSERT INTO users (user_name) VALUES($1) returning *', [user_name]);
        res.json(newUser);
    } catch (error) {
        console.error(err.message);
    }
});

//Update User
usersRouter.put('/', async (req, res) => {
    try {
        const {user_name, user_id} = req.body;
        const updatedUser = await pool.query('update users set user_name = $1 where user_id = $2 returning *', [user_name, user_id]);
        res.json(updatedUser);
    } catch (error) {
        console.error(err.message);
    }
});
//Delete User
usersRouter.delete('/', async (req, res) => {
    try {
        const {user_id} = req.body;
        const deletedUser = await pool.query('delete from users where user_id = $1 returning *', [user_id]);
        res.json(deletedUser);
    } catch (error) {
        console.error(err.message);
    }
})

module.exports = usersRouter;