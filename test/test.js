'use strict';

const assert = require('power-assert');
const path = require('path');
const Mysql = require('../index.js');

describe('Global', function() {

    it('transaction', async function() {

        const mysql = new Mysql({
            default: { host: 'localhost', user: 'test', password: '123', database: 'test' }
        });
        // @ts-ignore

        const con = mysql.getConnection()

        await con.start().catch(() => 0);
        await con.query('INSERT INTO tb_tag set name =1').catch(() => 0);
        await con.query('INSER2T INTO tb_tag set name =2').catch(() => 0);
        await con.commit().catch(() => 0);
        mysql.end();

    });

});