var db = require('pgpool.js');

module.exports = {
    insertOpinion: async function (id_message, id_user, content) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Opinion" ("id_message", "id_user", "content") VALUES ($1, $2, $3)', [id_message, id_user, content]);
    },
    getOpinion: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Opinion" WHERE "id_user" = $1', [id_user]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0]["id_message"];
    },
    deleteOpinion: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Opinion" WHERE "id_user" = $1', [id_user]);
    }
}