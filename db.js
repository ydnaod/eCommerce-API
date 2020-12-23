const Pool = require('pg').Pool;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'andydo',
    //password: '',
    database: 'ecom'
});

module.exports = pool;