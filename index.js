const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');

//Middleware
app.use(cors());
app.use(express.json()); //req.body

//Routes
app.use('/users', usersRouter);
app.use('/Auth', require('./routes/jwtAuth'));

//dashboard route
app.use('/dashboard', dashboardRouter);


app.listen(3000, () => {
    console.log('listening on 3000');
});