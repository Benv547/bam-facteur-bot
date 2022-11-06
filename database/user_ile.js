var db = require('./pgpool.js');

module.exports = {
    createUser: async function (id_user, id_channel, id_profile) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_ile" ("id_user", "id_channel", "id_profile") VALUES ($1, $2, $3)', [id_user, id_channel, id_profile]);
    },
    get_id_channel: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_channel" FROM "User_ile" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].id_channel;
        }
        return null;
    },
    get_id_profile: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_profile" FROM "User_ile" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].id_profile;
        }
        return null;
    },
    deleteAllUser: async function () {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "User_ile"');
    },
    getRandNumber: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "randNumber" FROM "User_ile" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].randNumber;
        }
        return null;
    }
};