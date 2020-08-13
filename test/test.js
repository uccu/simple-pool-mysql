'use strict';

const assert = require('power-assert');
const path = require('path');
const Mysql = require('../index.js');

describe('Global', function() {

    it('transaction', async function() {

        const mysql = new Mysql({
            default: { host: 'localhost', user: 'root', password: 'root', database: 'test' }
        });
        // @ts-ignore

        const con = mysql.getConnection()

        // await con.start();
        const { insertId: id } = await con.query('INSERT INTO config set name =1');
        // await con.rollback();
        await con.query('INSERT INTO config set name =?', id);
        // await con.commit();
        // mysql.end();

    });

});