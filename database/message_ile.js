var db = require('./pgpool.js');

module.exports = {
    insertMessage: async function(id_message, id_user, id_channel, id_guild, content) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Message_ile" ("id_message", "id_user", "id_channel", "id_guild", "content") VALUES ($1, $2, $3, $4, $5)', [id_message, id_user, id_channel, id_guild, content]);
    },
    deleteMessageFromPastDay: async function() {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Message_ile" WHERE "date" < NOW() - INTERVAL \'1 day\'');
    },
    get_id_user: async function(id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_user" FROM "Message_ile" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_user"];
        }
        return null;
    }
};