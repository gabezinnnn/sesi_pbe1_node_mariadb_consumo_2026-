const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'gestao_consumo'
}).promise()

module.exports = connection
