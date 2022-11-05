var db = require('pgpool.js');

module.exports = {
    insertRole: async function (id_role, id_message) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Role" ("id_role", "id_message") VALUES ($1, $2)', [id_role, id_message]);
    },
    get_id_role: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_role" FROM "Role" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_role"];
        }
        return null;
    }
};