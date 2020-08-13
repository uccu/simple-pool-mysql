'use strict';

const assert = require('power-assert');
const mysql = require('mysql');




class Connection {

    /**
     * this is a constructor
     * @param {Promise<import('mysql').PoolConnection>} connection 
     */
    constructor(connection) {
        this._connection = connection;
        this.connection = null;
        this.isTransaction = false;
    }

    async getConnection() {
        if (!this.connection) this.connection = await this._connection;
        return this.connection;
    }

    /**
     * query
     * @param {string} sql sql
     * @param  {...any} values sql values
     * @return {Promise<any>} result
     */
    query(sql, ...values) {
        return new Promise(async (r, j) => {
            await this.getConnection();
            this.connection.query(sql, values, (err, results) => {
                if (!this.isTransaction) this.connection.release();
                if (err) j(err); else r(results);
            });
        });
    }

    start() {
        this.isTransaction = true;
        return new Promise(async (r, j) => {
            await this.getConnection();
            this.connection.beginTransaction((err) => {
                if (err) j(err); else r(true);
            });
        });
    }

    commit() {
        return new Promise(async (r, j) => {
            await this.getConnection();
            this.connection.commit((err) => {
                if (err) {
                    this.rollback().then(() => {
                        j(err);
                    });
                } else {
                    this.connection.release();
                    r(true);
                }
            });
        });
    }

    rollback() {
        return new Promise(async (r, j) => {
            await this.getConnection();
            this.connection.rollback((err) => {
                if (err) j(err); else {
                    this.connection.release();
                    r(true);
                }
            });
        });
    }

}



class Mysql {

    /**
     * this is constructor
     * @param {{[key:string]:import('mysql').PoolConfig}} options options
     */
    constructor(options) {
        this.options = options;
        this.pools = new Map;
    }

    /**
     * get pool
     * @param {string} poolName pool's name
     * @return {import('mysql').Pool} pool
     */
    getPool(poolName) {
        let pool = this.pools.get(poolName);
        if (pool) {
            return pool;
        }
        assert(this.options[poolName], 'can not get "' + poolName + '" pool config!');
        pool = mysql.createPool(this.options[poolName]);
        this.pools.set(poolName, pool);
        return pool;
    }

    /**
     * 
     * @param {string} poolName pool name
     * @return {Promise<import('mysql').PoolConnection>} PoolConnection
     */
    _getConnection(poolName = 'default') {
        return new Promise((r, j) => {
            this.getPool(poolName).getConnection(function(err, connection) {
                if (err) { j(err); return }
                r(connection);
            });
        });
    }


    /**
     * 
     * @param {string} poolName pool name
     * @return {Connection} connection
     */
    getConnection(poolName = 'default') {
        const connection = this._getConnection(poolName);
        return new Connection(connection);
    }


    /**
     * query the sql
     * @param {string} sql sql
     * @param {any[]} values values
     * @param {string} poolName pool name
     * @return {Promise<any>} result
     */
    query(sql, values = [], poolName = 'default') {
        return new Promise((r, j) => {
            this.getPool(poolName).query(sql, values, (error, results) => {
                if (error) j(error); else r(results);
            });
        });
    }

    /**
     * close the pool
     * @param {string} poolName pool
     * @return {Promise<boolean>} result
     */
    end(poolName = 'default') {
        return new Promise((r) => {
            this.getPool(poolName).end(() => {
                this.pools.delete(poolName);
                r(true);
            });
        });
    }

}


module.exports = exports = Mysql;
exports.default = exports.Mysql = exports;