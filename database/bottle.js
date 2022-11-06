var db = require('./pgpool.js');

module.exports = {
    insertBottle: async function (id_bottle, id_guild, id_user_sender, id_user_receiver, id_channel, name, nb_sea) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Bottle" ("id_bottle", "id_guild", "id_user_sender", "id_user_receiver", "id_user_author", "id_user_recipient", "id_channel", "name", "nb_sea") VALUES ($1, $2, $3, $4, $4, $3, $5, $6, $7)', [id_bottle, id_guild, id_user_sender, id_user_receiver, id_channel, name, nb_sea]);
    },
    getReceiver : async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT id_user_receiver FROM "Bottle" WHERE id_bottle = $1', [id_bottle]);
        if (results.rows.length > 0) {
            return results.rows[0].id_user_receiver;
        }
        return null;
    },
    switchSenderReceiver: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "id_user_sender" = "id_user_receiver", "id_user_receiver" = "id_user_sender" WHERE "id_bottle" = $1', [id_bottle]);
    },
    deleteBottle: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Bottle" WHERE "id_bottle" = $1', [id_bottle]);
    },
    incr_sea: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "nb_sea" = "nb_sea" + 1 WHERE "id_bottle" = $1', [id_bottle]);
    },
    get_sea: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT nb_sea FROM "Bottle" WHERE id_bottle = $1', [id_bottle]);
        if (results.rows.length > 0) {
            return results.rows[0].nb_sea;
        }
        return null;
    },
    getOldestBottleNotArchived: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT id_bottle FROM "Message" WHERE "id_message" IN (SELECT MAX("id_message") FROM "Message" GROUP BY "id_bottle") ORDER BY "date" ASC LIMIT 1;');
        if (results.rows.length > 0) {
            return results.rows[0].id_bottle;
        }
        return null;
    },
    setBottleArchived: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "archived" = true WHERE "id_bottle" = $1', [id_bottle]);
    },
    setBottleUnarchived: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "archived" = false WHERE "id_bottle" = $1', [id_bottle]);
    },
    setBottleTerminated: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "terminated" = true WHERE "id_bottle" = $1', [id_bottle]);
    },
    getBottleForUser: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_user_sender" = $1 OR "id_user_receiver" = $1', [id_user]);
        return results.rows;
    },
    getBottleForUserWithName: async function (id_user, name) {
        // Get bottle if name seems to be the same with %name%
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE ("id_user_sender" = $1 OR "id_user_receiver" = $1) AND "name" LIKE $2', [id_user, `%${name}%`]);
        return results.rows;
    },
    getBottle: async function (id_bottle) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_bottle" = $1', [id_bottle]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getAllBottleHasOnlyOneMessageFromSixHours: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_bottle" IN (SELECT "id_bottle" FROM "Message" GROUP BY "id_bottle" HAVING COUNT(*) = 1) AND "date" < NOW() - INTERVAL \'6 hours\'');
        return results.rows;
    },
    update_id_bottle_and_id_channel: async function (id_bottle, new_id_channel) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "id_bottle" = $2 WHERE "id_bottle" = $1', [id_bottle, new_id_channel]);
    },
    getDateOfLastBottleWithOneMessageOfUser: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT date FROM "Bottle" WHERE "id_bottle" IN (SELECT "id_bottle" FROM "Message" GROUP BY "id_bottle" HAVING COUNT(*) = 1) AND "id_user_receiver" = $1 ORDER BY "date" DESC LIMIT 1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].date;
        }
        return null;
    },

    getBottleCountForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Bottle" WHERE "date" > NOW() - INTERVAL \'7 days\'');
        return results.rows[0]["count"];
    },
    getBottleCountEachDayForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'dd/MM\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'7 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getBottleCountForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Bottle" WHERE "date" > NOW() - INTERVAL \'30 days\'');
        return results.rows[0]["count"];
    },
    getBottleCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'dd/MM\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'30 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getBottleCountForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Bottle" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date)');
        return results.rows[0]["count"];
    },
    getBottleCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY-MM\') AS time FROM "Bottle" WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM current_date) GROUP BY time ORDER BY time ASC');
        return results.rows;
    }
}