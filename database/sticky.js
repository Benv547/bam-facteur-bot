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
    insertSticky: async function (id_guild, id_channel, id_message) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Sticky" ("id_guild", "id_channel", "id_message") VALUES ($1, $2, $3)', [id_guild, id_channel, id_message]);
    },
    deleteSticky: async function (id_channel) {
        const pool = getPool();
        return await pool.query('DELETE FROM "Sticky" WHERE "id_channel" = $1', [id_channel]);
    },
    getAllStickies: async function () {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Sticky"');
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    update_id_lastReply: async function (id_channel, id_lastReply) {
        const pool = getPool();
        return await pool.query('UPDATE "Sticky" SET "id_lastReply" = $1 WHERE "id_channel" = $2', [id_lastReply, id_channel]);
    }
};