const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log('yo world');
    res.send('yo');
})

app.listen(3000, () => {
    console.log('listening on 3000');
});