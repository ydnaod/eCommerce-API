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

//Get All Users
usersRouter.get('/', async (req, res) => {
    try {
        const users = await pool.query('select * from users');
        console.log(users.rows);
        res.send(users.rows);
    } catch (error) {
        console.error(err.message);
    }
});

//Get user bu ID
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
        const { user_name, user_email, user_password } = req.body;
        const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_passwprd) VALUES($1, $2, $3) returning *', [user_name, user_email, user_password]);
        res.json(newUser);
    } catch (error) {
        console.error(err.message);
    }
});

//Update User
usersRouter.put('/:userId', async (req, res) => {
    try {
        const {user_name} = req.body;
        const updatedUser = await pool.query('update users set user_name = $1 where user_id = $2 returning *', [user_name, req.id]);
        res.json(updatedUser);
    } catch (error) {
        console.error(err.message);
    }
});
//Delete User
usersRouter.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await pool.query('delete from users where user_id = $1 returning *', [req.id]);
        res.json(deletedUser);
    } catch (error) {
        console.error(err.message);
    }
})

module.exports = usersRouter;