const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'jorge',
    password: '1234',
    database: 'attendance_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;