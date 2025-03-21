var db = require('./pgpool.js');

module.exports = {
    insertMessage: async function (id_message, id_bottle, id_user, content) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Message" ("id_message", "id_bottle", "id_user", "content") VALUES ($1, $2, $3, $4)', [id_message, id_bottle, id_user, content]);
    },
    getFirstMessage: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" ASC LIMIT 1', [id_bottle]);
        return results.rows[0]["content"];
    },
    getLastMessageId: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" DESC LIMIT 1', [id_bottle]);
        return results.rows[0]["id_message"];
    },
    get10LastMessages: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" DESC LIMIT 10', [id_bottle]);
        return results.rows;
    },
    getMessagesOfBottle: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_bottle" = $1 ORDER BY "id_message" ASC', [id_bottle]);
        return results.rows;
    },
    deleteAllMessagesOfBottle: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Message" WHERE "id_bottle" = $1', [id_bottle]);
    },
    getContentOfMessage: async function (id_message) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE "id_message" = $1', [id_message]);
        return results.rows[0]["content"];
    },
    update_id_message: async function (id_message, id_message_new) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Message" SET "id_message" = $1 WHERE "id_message" = $2', [id_message_new, id_message]);
    },

    getMessageCountForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Message" WHERE "date" > NOW() - INTERVAL \'7 days\'');
        return results.rows[0]["count"];
    },
    getMessageCountEachDayForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Message" WHERE date > NOW() - INTERVAL \'7 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getMessageCountForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Message" WHERE "date" > NOW() - INTERVAL \'30 days\'');
        return results.rows[0]["count"];
    },
    getMessageCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Message" WHERE date > NOW() - INTERVAL \'30 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getMessageCountForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Message" WHERE date >= (current_date - INTERVAL \'1 year\')');
        return results.rows[0]["count"];
    },
    getMessageCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('\n' +
            'SELECT COUNT(*) AS count, to_char(date, \'YYYY/MM\') AS time FROM "Message" WHERE date >= (current_date - INTERVAL \'1 year\') GROUP BY time ORDER BY time ASC');
        return results.rows;
    }
};