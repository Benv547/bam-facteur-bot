var db = require('pgpool.js');


module.exports = {
    insertSignalement: async function (id_message, id_sender, id_receiver, content, id_bottle, id_warn) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Signalement" ("id_message", "id_sender", "id_receiver", "content", "id_bottle", "id_warn") VALUES ($1, $2, $3, $4, $5, $6)', [id_message, id_sender, id_receiver, content, id_bottle, id_warn]);
    },
    get_id_sender: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_sender" FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_sender"];
        }
        return null;
    },
    get_id_receiver: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_receiver" FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_receiver"];
        }
        return null;
    },
    get_id_bottle: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_bottle" FROM "Signalement" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_bottle"];
        }
        return null;
    },
    get_id_message: async function (id_warn) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_message" FROM "Signalement" WHERE id_warn = $1', [id_warn]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_message"];
        }
        return null;
    }
};