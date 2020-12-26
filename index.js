const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const orderDetailsRouter = require('./routes/orderDetails')

//Middleware
app.use(cors());
app.use(express.json()); //req.body

//Routes
app.use('/users', usersRouter);
app.use('/Auth', require('./routes/jwtAuth'));

//dashboard route
app.use('/dashboard', dashboardRouter);

//products route
app.use('/products', productsRouter);

//orders route
app.use('/orders', ordersRouter)

//order_details route
app.use('/order_details', orderDetailsRouter);

app.listen(3000, () => {
    console.log('listening on 3000');
});