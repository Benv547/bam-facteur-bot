var db = require('./pgpool.js');

module.exports = {
    giveFooterToUser: async function (id_user, id_footer, id_guild) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_Footer" ("id_user", "id_footer", "id_guild") VALUES ($1, $2, $3)', [id_user, id_footer, id_guild]);
    },
    getAllFootersFromUser: async function (id_user, offset, limit) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Footer" WHERE "id_user" = $1 OFFSET $2 LIMIT $3', [id_user, offset, limit]);
        if (results.rows.length === 0) {
            return [];
        }
        return results.rows;
    },
    getFooter: async function (id_footer) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Footer" WHERE "id_footer" = $1', [id_footer]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getFooterFromUserWithName: async function (id_user, name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Footer" AS s INNER JOIN "User_Footer" AS us ON us."id_footer" = s."id_footer" WHERE us."id_user" = $1 AND s."name" ILIKE $2', [id_user, `%${name}%`]);
        return results.rows;
    },
    getFooterWithName: async function (name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Footer" WHERE "name" ILIKE $1', [`%${name}%`]);
        return results.rows;
    },
    getRandomWinnableFooter: async function (drop) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Footer" WHERE "winnable" = true AND "sharable_percentage" >= $1 ORDER BY RANDOM() LIMIT 1', [drop]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    insertFooter: async function (name, url, winnable, sharable, sharable_percentage) {
        const pool = db.getPool();
        const result = await pool.query(
            'INSERT INTO "Footer" ("name", "url", "winnable", "sharable", "sharable_percentage") VALUES ($1, $2, $3, $4, $5) RETURNING "id_footer"',
            [name, url, winnable, sharable, sharable_percentage]
        );
        return result.rows[0].id_footer;
    }
}