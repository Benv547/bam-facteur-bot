var db = require('./pgpool.js');

module.exports = {
    giveDecorationToUser: async function (id_user, id_decoration, id_guild) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_Decoration" ("id_user", "id_decoration", "id_guild") VALUES ($1, $2, $3)', [id_user, id_decoration, id_guild]);
    },
    getAllDecorationsFromUser: async function (id_user, offset, limit) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Decoration" WHERE "id_user" = $1 OFFSET $2 LIMIT $3', [id_user, offset, limit]);
        if (results.rows.length === 0) {
            return [];
        }
        return results.rows;
    },
    getDecoration: async function (id_decoration) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Decoration" WHERE "id_decoration" = $1', [id_decoration]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getDecorationFromUserWithName: async function (id_user, name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Decoration" AS s INNER JOIN "User_Decoration" AS us ON us."id_decoration" = s."id_decoration" WHERE us."id_user" = $1 AND s."name" ILIKE $2', [id_user, `%${name}%`]);
        return results.rows;
    },
    getDecorationWithName: async function (name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Decoration" WHERE "name" ILIKE $1', [`%${name}%`]);
        return results.rows;
    },
    getRandomWinnableDecoration: async function (drop) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Decoration" WHERE "winnable" = true AND "sharable_percentage" >= $1 ORDER BY RANDOM() LIMIT 1', [drop]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getAppliedDecorationFromUser: async function (id_user, id_guild) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Decoration" WHERE "applied" = true AND "id_user" = $1 AND "id_guild" = $2', [id_user, id_guild]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    insertDecoration: async function (name, url, winnable, sharable, sharable_percentage) {
        const pool = db.getPool();
        const result = await pool.query(
            'INSERT INTO "Decoration" ("name", "url", "winnable", "sharable", "sharable_percentage") VALUES ($1, $2, $3, $4, $5) RETURNING "id_decoration"',
            [name, url, winnable, sharable, sharable_percentage]
        );
        return result.rows[0].id_decoration;
    }
}