const { dbuser, dbhost, dbbase, dbpassword, dbport } = require('../db.json');

const Pool = require('pg').Pool
function getPool() {
    const pool = new Pool({
        user: dbuser,
        host: dbhost,
        database: dbbase,
        password: dbpassword,
        port: dbport
        // ssl: { rejectUnauthorized: false }
    })
    return pool;
}

module.exports = {
    insertHourly: async function (id_user) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Hourly" ("id_user") VALUES ($1)', [id_user]);
    },
    deleteHourly: async function () {
        const pool = getPool();
        return await pool.query('DELETE FROM "Hourly" WHERE "lastHourly" < NOW() - INTERVAL \'1 hour\'');
    },
    checkHourly: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Hourly" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return true;
        }
        return false;
    },
    get_hourly: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT "lastHourly" FROM "Hourly" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["lastHourly"];
        }
        return null;
    }
}