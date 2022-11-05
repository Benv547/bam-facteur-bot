var db = require('./pgpool.js');

module.exports = {
    insertTicket: async function (id_user, id_channel, id_guild) {
        const pool = db.getPool();
        const res = await pool.query('INSERT INTO "Ticket" (id_user, id_channel, id_guild) VALUES ($1, $2, $3)', [id_user, id_channel, id_guild]);
    },
    get_id_user: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_user" FROM "Ticket" WHERE id_channel = $1', [id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_user"];
        }
        return null;
    },
    get_id_channel: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_channel" FROM "Ticket" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_channel"];
        }
        return null;
    },
    deleteTicket: async function (id_channel) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Ticket" WHERE id_channel = $1', [id_channel]);
    },
    get_id_guild: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_guild" FROM "Ticket" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_guild"];
        }
        return null;
    },
    get_number_of_tickets: async function (id_guild) {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Ticket" WHERE id_guild = $1', [id_guild]);
        if (results.rows.length > 0) {
            return results.rows[0]["count"];
        }
        return null;
    }
};