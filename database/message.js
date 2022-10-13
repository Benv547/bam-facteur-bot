const { dbuser, dbhost, dbbase, dbpassword, dbport } = require('../config.json');

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
    insertMessage: async function (id_message, id_bottle, id_channel, id_user, content) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Message" ("id_message", "id_bottle", "id_channel", "id_user", "content") VALUES ($1, $2, $3, $4, $5)', [id_message, id_bottle, id_channel, id_user, content]);
    },
    getFirstMessage: async function (id_channel) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_channel" = $1 ORDER BY "id_message" ASC LIMIT 1', [id_channel]);
        return results.rows[0]["content"];
    },
    getLastMessageId: async function (id_channel) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_channel" = $1 ORDER BY "id_message" DESC LIMIT 1', [id_channel]);
        return results.rows[0]["id_message"];
    },
    deleteAllMessagesOfBottle: async function (id_bottle) {
        const pool = getPool();
        return await pool.query('DELETE FROM "Message" WHERE "id_bottle" = $1', [id_bottle]);
    }
};