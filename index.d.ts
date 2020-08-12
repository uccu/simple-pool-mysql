
/// <reference types="node" />




class Mysql {
    constructor(option: { [key: string]: import('mysql').PoolConfig });

    getConnection: (poolName?: string) => any;
    query: (sql: string, values?: any[], poolName?: string) => Promise<any>;
    end: (poolName?: string) => Promise<boolean>;
}

export = Mysql;