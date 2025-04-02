var db = require('./pgpool.js');

module.exports = {
    createUser: async function (id_user, money, xp) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User" ("id_user", "money", "xp") VALUES ($1, $2, $3)', [id_user, money, xp]);
    },
    getUser: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getAnniversaire: async function (monthDate, dayDate) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User" WHERE "anniversaireJour" = $1 AND "anniversaireMois" = $2', [dayDate, monthDate]); 
        if (results.rows.length > 0) {
            return results.rows;
        }
        return null;
    },
    deleteUser: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "User" WHERE "id_user" = $1', [id_user]);
    },
    update_diceBearSeed: async function (id_user, diceBearSeed) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "diceBearSeed" = $1 WHERE "id_user" = $2', [diceBearSeed, id_user]);
    },
    update_signature: async function (id_user, signature) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "signature" = $1 WHERE "id_user" = $2', [signature, id_user]);
    },
    update_id_sticker: async function (id_user, id_sticker) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "id_sticker" = $1 WHERE "id_user" = $2', [id_sticker, id_user]);
    },
    get_id_sticker: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_sticker" FROM "User" WHERE "id_user" = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_sticker"];
        }
        return null;
    },
    update_id_footer: async function (id_user, id_footer) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "id_footer" = $1 WHERE "id_user" = $2', [id_footer, id_user]);
    },
    get_id_footer: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "id_footer" FROM "User" WHERE "id_user" = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["id_footer"];
        }
        return null;
    },
    update_anniversaire: async function (id_user, jour, mois) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "anniversaireJour" = $1, "anniversaireMois" = $2 WHERE "id_user" = $3', [jour, mois, id_user]);
    },
    get_nb_invite: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "nb_invite" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].nb_invite;
        }
        return null;
    },
    incr_money: async function (id_user, qte) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "money" = "money" + $1 WHERE "id_user" = $2', [qte, id_user]);
    },
    incr_money_spent: async function (id_user, qte) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "money_spent" = "money_spent" + $1 WHERE "id_user" = $2', [qte, id_user]);
    },
    reduce_money: async function (id_user, qte) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "money" = "money" - $1 WHERE "id_user" = $2', [qte, id_user]);
    },
    incr_xp: async function (id_user, qte) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "xp" = "xp" + $1 WHERE "id_user" = $2', [qte, id_user]);
    },
    getXp: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "xp" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].xp;
        }
        return null;
    },
    set_vip: async function (id_user, vip = true) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "isVIP" = $1 WHERE "id_user" = $2', [vip, id_user]);
    },
    incr_nb_treasures: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "nb_treasures" = "nb_treasures" + 1 WHERE "id_user" = $1', [id_user]);
    },

    getTotalOfMoneyAndXp: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT SUM("money") as money, SUM("xp") as xp FROM "User"');
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },

    getRankOr: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('select "rank" from (select RANK() OVER(ORDER BY money DESC), id_user from "User") AS derivedTable Where id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["rank"];
        }
        return null;
    },

    getRankXp: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('select "rank" from (select RANK() OVER(ORDER BY xp DESC), id_user from "User") AS derivedTable Where id_user = $1', [id_user] );
        if (results.rows.length > 0) {
            return results.rows[0]["rank"];
        }
        return null;
    },

    incr_afk_number: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "afk_number" = "afk_number" + 1 WHERE "id_user" = $1', [id_user]);
    },
    reset_afk_number: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "afk_number" = 0 WHERE "id_user" = $1', [id_user]);
    },
    get_afk_number: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "afk_number" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].afk_number;
        }
        return null;
    },

    set_date_bottle: async function (id_user, date) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "date_bottle" = $1 WHERE "id_user" = $2', [date, id_user]);
    },
    set_date_bird: async function (id_user, date) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "date_bird" = $1 WHERE "id_user" = $2', [date, id_user]);
    },
    set_date_wanted: async function (id_user, date) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "date_wanted" = $1 WHERE "id_user" = $2', [date, id_user]);
    },
    get_date_bottle: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date_bottle" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].date_bottle;
        }
        return null;
    },
    get_date_bird: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date_bird" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].date_bird;
        }
        return null;
    },
    get_date_wanted: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date_wanted" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].date_wanted;
        }
        return null;
    },
    set_date_treasure: async function (id_user, date) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "date_treasure" = $1 WHERE "id_user" = $2', [date, id_user]);
    },
    get_date_treasure: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date_treasure" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].date_treasure;
        }
        return null;
    },
    getNumberOfUsersHasTreasureDateNotNull: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "User" WHERE "date_treasure" IS NOT NULL');
        if (results.rows.length > 0) {
            return results.rows[0].count;
        }
        return 0;
    },
    getUsersWhenDateTreasureIsOlderThan20Min: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User" WHERE "date_treasure" < NOW() - INTERVAL \'20 minutes\'');
        if (results.rows.length > 0) {
            return results.rows;
        }
        return [];
    },
    remove_date_treasure: async function (id_user) {
        const pool = db.getPool();
        return await pool.query('UPDATE "User" SET "date_treasure" = NULL WHERE "id_user" = $1', [id_user]);
    }
}