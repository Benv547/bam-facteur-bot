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
    insertSuggestions: async function (id_message, id_user, content, isReply) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Suggestion" ("id_message", "id_user", "content", "isReply") VALUES ($1, $2, $3, $4)', [id_message, id_user, content, isReply]);
    },
    getTotalNumberOfSuggestions: async function () {
        const pool = getPool();
        const result = await pool.query('SELECT COUNT(*) FROM "Suggestion" WHERE "isReply" = false');
        return result.rows[0].count;
    },
    getTotalOfReplies: async function () {
        const pool = getPool();
        const result = await pool.query('SELECT COUNT(*) FROM "Suggestion" WHERE "isReply" = true');
        return result.rows[0].count;
    },
    get_id_user: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT "id_user" FROM "Suggestion" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_user"];
        }
        return null;
    }
};