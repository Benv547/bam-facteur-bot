var db = require('./pgpool.js');

module.exports = {
    insertHourly: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Hourly" ("id_user") VALUES ($1)', [id_user]);
    },
    deleteHourly: async function () {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Hourly" WHERE "lastHourly" < NOW() - INTERVAL \'1 hour\'');
    },
    checkHourly: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Hourly" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return true;
        }
        return false;
    },
    get_hourly: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "lastHourly" FROM "Hourly" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["lastHourly"];
        }
        return null;
    }
}