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
    insertMessage: async function (id_message, id_bottle, id_user, content) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Message" ("id_message", "id_bottle", "id_user", "content") VALUES ($1, $2, $3, $4)', [id_message, id_bottle, id_user, content]);
    },
    getFirstMessage: async function (id_bottle) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" ASC LIMIT 1', [id_bottle]);
        return results.rows[0]["content"];
    },
    getLastMessageId: async function (id_bottle) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" DESC LIMIT 1', [id_bottle]);
        return results.rows[0]["id_message"];
    },
    get10LastMessages: async function (id_bottle) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" DESC LIMIT 10', [id_bottle]);
        return results.rows;
    },
    getMessagesOfBottle: async function (id_bottle) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" ASC', [id_bottle]);
        return results.rows;
    },
    deleteAllMessagesOfBottle: async function (id_bottle) {
        const pool = getPool();
        return await pool.query('DELETE FROM "Message" WHERE "id_bottle" = $1', [id_bottle]);
    },
    getContentOfMessage: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_message" = $1', [id_message]);
        return results.rows[0]["content"];
    },
    update_id_message: async function (id_message, id_message_new) {
        const pool = getPool();
        return await pool.query('UPDATE "Message" SET "id_message" = $1 WHERE "id_message" = $2', [id_message_new, id_message]);
    }
};