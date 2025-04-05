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
    },

    createUserIleTicket: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_ile_ticket" ("id_user") VALUES ($1)', [id_user]);
    },
    checkUserIleTicket: async function () {
        const pool = db.getPool();
        // delete all tickets for the user when date is expired, and return all id_user
        const results = await pool.query('DELETE FROM "User_ile_ticket" WHERE "date" < NOW() RETURNING "id_user"');
        if (results.rows.length > 0) {
            return results.rows;
        }
        return [];
    },
    getUserIleTicketDate: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date" FROM "User_ile_ticket" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].date;
        }
        return null;
    }
};