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
    updateBottleSender: async function (id_bottle, id_user_sender) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "id_user_sender" = $2 WHERE "id_bottle" = $1', [id_bottle, id_user_sender]);
    },
    switchSenderReceiver: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bottle" SET "id_user_sender" = "id_user_receiver", "id_user_receiver" = "id_user_sender" WHERE "id_bottle" = $1', [id_bottle]);
    },
    deleteBottle: async function (id_bottle) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Bottle" WHERE "id_bottle" = $1', [id_bottle]);
    },
    deleteBottleWithChannel: async function (id_channel) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Bottle" WHERE "id_channel" = $1', [id_channel]);
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
        const results = await pool.query('SELECT m.id_bottle FROM "Message" as m, "Bottle" as b WHERE m."id_message" IN (SELECT MAX("id_message") FROM "Message" GROUP BY "id_bottle") AND m."id_bottle" = b."id_bottle" AND b."archived" = false ORDER BY m."date" ASC LIMIT 1');
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
    getBottleForUserWithOffsetAndLimit: async function (id_user, offset, limit) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_user_sender" = $1 OR "id_user_receiver" = $1 ORDER BY "date" DESC OFFSET $2 LIMIT $3', [id_user, offset, limit]);
        return results.rows;
    },
    getBottleForUserWithName: async function (id_user, name) {
        // Get bottle if name seems to be the same with %name%
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE ("id_user_sender" = $1 OR "id_user_receiver" = $1) AND "name" ILIKE $2', [id_user, `%${name}%`]);
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
    getBottleWithId: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_channel" = $1', [id_channel]);
        if (results.rows.length > 0) {
            return (true);
        }
        return (false);
    },
    getAllBottleHasOnlyOneMessageFromThreeHoursAndNotArchivedAndNotTerminated: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_bottle" IN (SELECT "id_bottle" FROM "Message" GROUP BY "id_bottle" HAVING COUNT(*) = 1) AND "date" < NOW() - INTERVAL \'6 hours\' AND "archived" = false AND "terminated" = false');
        return results.rows;
    },
    getAllBottleHasOnlyOneMessageAndArchivedAndNotTerminatedRandomized: async function (limit) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bottle" WHERE "id_bottle" IN (SELECT "id_bottle" FROM "Message" GROUP BY "id_bottle" HAVING COUNT(*) = 1) AND "archived" = true AND "terminated" = false ORDER BY RANDOM() LIMIT $1', [limit]);
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
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'7 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },
    getBottleArchivedCountEachDayForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'7 days\' AND "archived" = true AND "terminated" = false GROUP BY time ORDER BY time ASC');
        return results.rows;
    },
    getBottleTerminatedCountEachDayForOneWeek: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'7 days\' AND "terminated" = true GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getBottleCountForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Bottle" WHERE "date" > NOW() - INTERVAL \'30 days\'');
        return results.rows[0]["count"];
    },
    getBottleCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'30 days\' GROUP BY time ORDER BY time ASC');
        return results.rows;
    },
    getBottleArchivedCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'30 days\' AND "archived" = true AND "terminated" = false GROUP BY time ORDER BY time ASC');
        return results.rows;
    },
    getBottleTerminatedCountEachDayForOneMonth: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'MM/dd\') AS time FROM "Bottle" WHERE date > NOW() - INTERVAL \'30 days\' AND "terminated" = true GROUP BY time ORDER BY time ASC');
        return results.rows;
    },

    getBottleCountForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Bottle" WHERE date >= (current_date - INTERVAL \'1 year\')');
        return results.rows[0]["count"];
    },
    getBottleCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY/MM\') AS time FROM "Bottle" WHERE date >= (current_date - INTERVAL \'1 year\') GROUP BY time ORDER BY time ASC');
        return results.rows;
    },
    getBottleArchivedCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY/MM\') AS time FROM "Bottle" WHERE date >= (current_date - INTERVAL \'1 year\') AND "archived" = true AND "terminated" = false GROUP BY time ORDER BY time ASC');
        return results.rows;
    },
    getBottleTerminatedCountEachMonthForThisYear: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) AS count, to_char(date, \'YYYY/MM\') AS time FROM "Bottle" WHERE date >= (current_date - INTERVAL \'1 year\') AND "terminated" = false GROUP BY time ORDER BY time ASC');
        return results.rows;
    }
}