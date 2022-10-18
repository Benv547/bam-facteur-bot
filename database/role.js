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
    insertRole: async function (id_role, id_message) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Role" ("id_role", "id_message") VALUES ($1, $2)', [id_role, id_message]);
    },
    get_id_role: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT "id_role" FROM "Role" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_role"];
        }
        return null;
    }
};