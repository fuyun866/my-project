var mysql = require('mysql2');

var conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'MYSQL',
    database: 'newbooks'
});

conn.connect(err => {
    console.log(err, "如果为null,就是连接成功");
});

module.exports = conn
