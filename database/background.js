var db = require('./pgpool.js');

module.exports = {
    giveBackgroundToUser: async function (id_user, id_background, id_guild) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_Background" ("id_user", "id_background", "id_guild") VALUES ($1, $2, $3)', [id_user, id_background, id_guild]);
    },
    getAllBackgroundsFromUser: async function (id_user, offset, limit) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Background" WHERE "id_user" = $1 OFFSET $2 LIMIT $3', [id_user, offset, limit]);
        if (results.rows.length === 0) {
            return [];
        }
        return results.rows;
    },
    getBackground: async function (id_background) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Background" WHERE "id_background" = $1', [id_background]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getBackgroundFromUserWithName: async function (id_user, name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Background" AS s INNER JOIN "User_Background" AS us ON us."id_background" = s."id_background" WHERE us."id_user" = $1 AND s."name" ILIKE $2', [id_user, `%${name}%`]);
        return results.rows;
    },
    getBackgroundWithName: async function (name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Background" WHERE "name" ILIKE $1', [`%${name}%`]);
        return results.rows;
    },
    getRandomWinnableBackground: async function (drop) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Background" WHERE "winnable" = true AND "sharable_percentage" >= $1 ORDER BY RANDOM() LIMIT 1', [drop]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getAppliedBackgroundFromUser: async function (id_user, id_guild) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Background" WHERE "applied" = true AND "id_user" = $1 AND "id_guild" = $2', [id_user, id_guild]);
        if (results.rows.length === 0) {
            // get the default background
            const defaultBackground = await pool.query('SELECT * FROM "Background" WHERE "name" = $1', ['Défaut']);
            if (defaultBackground.rows.length === 0) {
                return null;
            }
            return defaultBackground.rows[0];
        }
        return results.rows[0];
    },
    insertBackground: async function (name, url, winnable, sharable, sharable_percentage) {
        const pool = db.getPool();
        const result = await pool.query(
            'INSERT INTO "Background" ("name", "url", "winnable", "sharable", "sharable_percentage") VALUES ($1, $2, $3, $4, $5) RETURNING "id_background"',
            [name, url, winnable, sharable, sharable_percentage]
        );
        return result.rows[0].id_background;
    }
}