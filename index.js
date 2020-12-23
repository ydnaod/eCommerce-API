const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');

//Middleware
app.use(cors());
app.use(express.json()); //req.body

//Routes

//Get User
app.get('/', (req, res) => {
    console.log('yo world');
    res.send('yo');
})

//Create User
app.post('/users', async (req, res) => {
    try {
        const { user_name } = req.body;
        console.log(user_name);
        const newUser = await pool.query('INSERT INTO users (user_name) VALUES($1)', [user_name]);
        res.json(newUser);
    } catch (error) {
        console.error(err.message);
    }
})

//Update User

//Delete User

app.listen(3000, () => {
    console.log('listening on 3000');
});