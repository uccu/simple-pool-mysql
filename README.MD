
[![Build Status](https://www.travis-ci.org/uccu/simple-pool-mysql.svg?branch=master)](https://www.travis-ci.org/uccu/simple-pool-mysql)
[![Maintainability](https://api.codeclimate.com/v1/badges/d5514d5c92235d5b7d68/maintainability)](https://codeclimate.com/github/uccu/simple-pool-mysql/maintainability)
[![codecov](https://codecov.io/gh/uccu/simple-pool-mysql/branch/master/graph/badge.svg)](https://codecov.io/gh/uccu/simple-pool-mysql)
[![GitHub issues](https://img.shields.io/github/issues/uccu/simple-pool-mysql)](https://github.com/uccu/simple-pool-mysql/issues)
![GitHub](https://img.shields.io/github/license/uccu/simple-pool-mysql)

### LICENSE
MIT

### GOAL
Bind a directory to an object and load the modules in the directory dynamically.

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
