var db = require('./pgpool.js');


module.exports = {
    insertWanted: async function (id_channel, id_guild, id_user, id_message, name, content) {
        const pool = await db.getPool();
        return await pool.query('INSERT INTO "Wanted" (id_channel, id_guild, id_user, id_message, name, content) VALUES ($1, $2, $3, $4, $5, $6)', [id_channel, id_guild, id_user, id_message, name, content]);
    },
    get_wanted: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Wanted" WHERE id_channel = $1', [id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    get_wanted_by_id: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Wanted" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    get_wanted_response: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "WantedResponse" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    get_id_message: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_message" FROM "Wanted" WHERE id_channel = $1', [id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_message"];
        }
        return null;
    },
    get_id_channel: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_channel" FROM "Wanted" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_channel"];
        }
        return null;
    },
    get_id_user: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_user" FROM "Wanted" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_user"];
        }
        return null;
    },
    getDateOfLastWantedForUser: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date" FROM "Wanted" WHERE "id_user" = $1 ORDER BY "date" DESC LIMIT 1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["date"];
        }
        return null;
    },
    deleteWanted: async function (id_channel) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Wanted" WHERE "id_channel" = $1', [id_channel]);
    },
    setArchived: async function (id_channel) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Wanted" SET "archived" = true WHERE "id_channel" = $1', [id_channel]);
    },


    insertWantedResponse: async function (id_channel, id_guild, id_user, id_message, content) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "WantedResponse" ("id_channel", "id_guild", "id_user", "id_message", "content") VALUES ($1, $2, $3, $4, $5)', [id_channel, id_guild, id_user, id_message, content]);
    },
    getAllReplies: async function (id_channel) {
        const pool = db.getPool();
        const result = await pool.query('SELECT "id_message" FROM "WantedResponse" WHERE "id_channel" = $1', [id_channel]);
        return result.rows;
    },
    get_id_user_response: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_user" FROM "WantedResponse" WHERE id_message = $1', [id_message]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_user"];
        }
        return null;
    },
    get_reply_for_user_and_channel: async function (id_user, id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_message" FROM "WantedResponse" WHERE "id_user" = $1 AND "id_channel" = $2', [id_user, id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_message"];
        }
        return null;
    },
    getWantedFromThreeHoursAndNotArchived: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Wanted" WHERE "date" < NOW() - INTERVAL \'48 hours\' AND "archived" = false');
        return results.rows;
    },


    getWantedCountForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Wanted" WHERE "date" > NOW() - INTERVAL \'7 days\'');
        return results.rows[0]["count"];
    },
    getWantedCountEachDayForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Wanted" WHERE date > NOW() - INTERVAL \'7 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getWantedCountForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Wanted" WHERE "date" > NOW() - INTERVAL \'30 days\'');
        return results.rows[0]["count"];
    },
    getWantedCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Wanted" WHERE date > NOW() - INTERVAL \'30 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getWantedCountForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Wanted" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date)');
        return results.rows[0]["count"];
    },
    getWantedCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY/MM\') AS time FROM "Wanted" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) GROUP BY time ORDER BY time ASC');
        return results.rows;
    },


    getRepliesCountForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "WantedResponse" WHERE "date" > NOW() - INTERVAL \'7 days\'');
        return results.rows[0]["count"];
    },
    getRepliesCountEachDayForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "WantedResponse" WHERE date > NOW() - INTERVAL \'7 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getRepliesCountForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "WantedResponse" WHERE "date" > NOW() - INTERVAL \'30 days\'');
        return results.rows[0]["count"];
    },
    getRepliesCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "WantedResponse" WHERE date > NOW() - INTERVAL \'30 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getRepliesCountForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "WantedResponse" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date)');
        return results.rows[0]["count"];
    },
    getRepliesCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY/MM\') AS time FROM "WantedResponse" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) GROUP BY time ORDER BY time ASC');
        return results.rows;
    }
};