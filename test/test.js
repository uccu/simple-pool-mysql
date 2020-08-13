'use strict';

const assert = require('power-assert');
const path = require('path');
const Mysql = require('../index.js');

describe('Global', function() {

    it('transaction', async function() {

        const mysql = new Mysql({
            default: { host: '192.168.6.188', user: 'cat', password: '123', database: 'videodb' }
        });
        // @ts-ignore

        const con = mysql.getConnection()

        await con.start();
        const { insertId: id } = await con.query('INSERT INTO tb_tag set name =1');
        await con.query('INSERT INTO tb_tag set name =?', id);
        await con.commit();
        mysql.end();

    });

});