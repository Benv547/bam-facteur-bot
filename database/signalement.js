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
    insertSignalement: async function (id_message, id_sender, id_receiver, content, id_bottle) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Signalement" ("id_message", "id_sender", "id_receiver", "content", "id_bottle") VALUES ($1, $2, $3, $4, $5)', [id_message, id_sender, id_receiver, content, id_bottle]);
    },
    get_id_sender: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT "id_sender" FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_sender"];
        }
        return null;
    },
    get_id_receiver: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT "id_receiver" FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_receiver"];
        }
        return null;
    },
    get_id_bottle: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT "id_bottle" FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_bottle"];
        }
        return null;
    }
};