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

    insertRecord: async function (score, type) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Record" ("score", "type") VALUES ($1, $2)', [score, type]);
    },

    getCountForOneWeek: async function (type) {
        const pool = getPool();
        const results = await pool.query('SELECT MAX(score) AS count FROM "Record" WHERE "date" > NOW() - INTERVAL \'7 days\' AND "type" = $1', [type]);
        return results.rows[0]["count"];
    },
    getCountEachDayForOneWeek: async function (type) {
        const pool = getPool();
        const results = await pool.query('SELECT SUM(score) AS count, to_char(date, \'dd/MM\') AS time FROM "Record" WHERE date > NOW() - INTERVAL \'7 days\' AND "type" = $1 GROUP BY time ORDER BY time ASC', [type]);
        return results.rows;
    },

    getCountForOneMonth: async function (type) {
        const pool = getPool();
        const results = await pool.query('SELECT MAX(score) AS count FROM "Record" WHERE "date" > NOW() - INTERVAL \'30 days\' AND "type" = $1', [type]);
        return results.rows[0]["count"];
    },
    getCountEachDayForOneMonth: async function (type) {
        const pool = getPool();
        const results = await pool.query('SELECT SUM(score) AS count, to_char(date, \'dd/MM\') AS time FROM "Record" WHERE date > NOW() - INTERVAL \'30 days\' AND "type" = $1 GROUP BY time ORDER BY time ASC', [type]);
        return results.rows;
    },

    getCountForThisYear: async function (type) {
        const pool = getPool();
        const results = await pool.query('SELECT MAX(score) AS count FROM "Record" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) AND "type" = $1', [type]);
        return results.rows[0]["count"];
    },
    getCountEachMonthForThisYear: async function (type) {
        const pool = getPool();
        const results = await pool.query('SELECT SUM(score) AS count, to_char(date, \'MM/YYYY\') AS time FROM "Record" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) AND "type" = $1 GROUP BY time ORDER BY time ASC', [type]);
        return results.rows;
    }
};