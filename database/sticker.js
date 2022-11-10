var db = require('./pgpool.js');

module.exports = {
    giveStickerToUser: async function (id_user, id_sticker, id_guild) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_Sticker" ("id_user", "id_sticker", "id_guild") VALUES ($1, $2, $3)', [id_user, id_sticker, id_guild]);
    },
    getAllStickersFromUser: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Sticker" WHERE "id_user" = $1', [id_user]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    },
    getSticker: async function (id_sticker) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Sticker" WHERE "id_sticker" = $1', [id_sticker]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getStickerFromUserWithName: async function (id_user, name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Sticker" AS s INNER JOIN "User_Sticker" AS us ON us."id_sticker" = s."id_sticker" WHERE us."id_user" = $1 AND s."name" ILIKE $2', [id_user, `%${name}%`]);
        return results.rows;
    },
    getStickerWithName: async function (name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Sticker" WHERE "name" ILIKE $1', [`%${name}%`]);
        return results.rows;
    },
    getRandomWinnableSticker: async function (drop) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Sticker" WHERE "winnable" = true AND "sharable_percentage" >= $1 ORDER BY RANDOM() LIMIT 1', [drop]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    }
}