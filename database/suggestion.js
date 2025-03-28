var db = require('./pgpool.js');

module.exports = {
    insertSuggestions: async function (id_message, id_thread, id_user, content, isReply) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Suggestion" ("id_message", "id_thread", "id_user", "content", "isReply") VALUES ($1, $2, $3, $4, $5)', [id_message, id_thread, id_user, content, isReply]);
    },
    getTotalNumberOfSuggestions: async function () {
        const pool = db.getPool();
        const result = await pool.query('SELECT COUNT(*) FROM "Suggestion" WHERE "isReply" = false');
        return result.rows[0].count;
    },
    getTotalOfReplies: async function () {
        const pool = db.getPool();
        const result = await pool.query('SELECT COUNT(*) FROM "Suggestion" WHERE "isReply" = true');
        return result.rows[0].count;
    },
    get_id_user: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_user" FROM "Suggestion" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_user"];
        }
        return null;
    },
    get_id_thread: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_thread" FROM "Suggestion" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_thread"];
        }
        return null;
    },
    getSuggestion: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Suggestion" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    }
};