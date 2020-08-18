'use strict';

const mysql = require('mysql');
const util = require('util');



class Connection {

    /**
     * this is a constructor
     * @param {import('mysql').Pool} pool 
     */
    constructor(pool) {
        this.pool = pool;
        this.connection = null;
        this.isTransaction = false;
    }

    /**
     * @return {Promise<import('mysql').PoolConnection>} connection
     */
    async getConnection() {
        if (!this.connection) {
            this.connection = await util
                .promisify(this.pool.getConnection)
                .call(this.pool)
                .catch(err => {
                    throw err;
                });
        }
        return this.connection;
    }

    /**
     * query
     * @param {string} sql sql
     * @param  {...any} values sql values
     * @return {Promise<any>} result
     */
    query(sql, ...values) {
        return this.getConnection().then(conn => util.promisify(conn.query).call(conn, sql, values)).then((result) => {
            return result;
        });
    }

    start() {
        this.isTransaction = true;
        return this.getConnection().then(conn => util.promisify(conn.beginTransaction).call(conn).catch(e => {
            conn.release(); throw e;
        }));
    }

    commit() {

        return this.getConnection().then(conn => util.promisify(conn.commit).call(conn).catch(e => {
            this.rollback(); throw e;
        })).then((result) => {
            this.release();
            return result;
        });
    }

    rollback() {
        return this.getConnection().then(conn => util.promisify(conn.rollback).call(conn).catch(e => {
            this.release(); throw e;
        })).then((result) => {
            this.release();
            return result;
        });
    }

    release() {
        this.connection.release();
        this.connection = null;
        this.isTransaction = false;
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
        if (!this.options[poolName]) {
            throw new TypeError('can not get "' + poolName + '" pool config!');
        }
        pool = mysql.createPool(this.options[poolName]);
        this.pools.set(poolName, pool);
        return pool;
    }


    /**
     * 
     * @param {string} poolName pool name
     * @return {Connection} connection
     */
    getConnection(poolName = 'default') {
        const pool = this.getPool(poolName);
        return new Connection(pool);
    }


    /**
     * query the sql
     * @param {string} sql sql
     * @param {any[]} values values
     * @param {string} poolName pool name
     * @return {Promise<any>} result
     */
    query(sql, values = [], poolName = 'default') {
        const pool = this.getPool(poolName);
        return util.promisify(pool.query).call(pool, sql, values);
    }

    /**
     * close the pool
     * @param {string} poolName pool
     * @return {Promise<any>} result
     */
    end(poolName = 'default') {
        const pool = this.getPool(poolName);
        this.pools.delete(poolName);
        return util.promisify(pool.end).call(pool);
    }

}


module.exports = exports = Mysql;
exports.default = exports.Mysql = exports;