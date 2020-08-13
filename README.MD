
[![GitHub issues](https://img.shields.io/github/issues/uccu/simple-pool-mysql)](https://github.com/uccu/simple-pool-mysql/issues)
![GitHub](https://img.shields.io/github/license/uccu/simple-pool-mysql)

### LICENSE
MIT

### GOAL
simple pool mysql

### INSTALL
```javscript
npm i simple-pool-mysql
```

### HOW TO USE
```javascript
const mysql = new Mysql({
    default: { host: 'localhost', user: 'root', password: 'root', database: 'test' },
    test: { host: 'localhost', user: 'root', password: 'root', database: 'test' },
});

const data = await mysql.query('SELECT COUNT(1) AS count FROM user');
console.log(data[0].count);

```
