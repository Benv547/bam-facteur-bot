const { dbuser, dbhost, dbbase, dbpassword, dbport, adminRole} = require('../config.json');

const Pool = require('pg').Pool
function getPool() {
    const pool = new Pool({
        user: dbuser,
        host: dbhost,
        database: dbbase,
        password: dbpassword,
        port: dbport,
        ssl: { rejectUnauthorized: false }
    })
    return pool;
}

module.exports = {
    insertMessage: async function () {
        const pool = getPool();
        // TODO : sql query
    },
};