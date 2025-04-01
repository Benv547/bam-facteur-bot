var db = require('./pgpool.js');

module.exports = {
    giveLetterToUser: async function (id_user, id_letter, id_guild) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "User_Letter" ("id_user", "id_letter", "id_guild") VALUES ($1, $2, $3)', [id_user, id_letter, id_guild]);
    },
    getAllLettersFromUser: async function (id_user, offset, limit) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Letter" WHERE "id_user" = $1 OFFSET $2 LIMIT $3', [id_user, offset, limit]);
        if (results.rows.length === 0) {
            return [];
        }
        return results.rows;
    },
    getLetter: async function (id_letter) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Letter" WHERE "id_letter" = $1', [id_letter]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getLetterFromUserWithName: async function (id_user, name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Letter" AS s INNER JOIN "User_Letter" AS us ON us."id_letter" = s."id_letter" WHERE us."id_user" = $1 AND s."name" ILIKE $2', [id_user, `%${name}%`]);
        return results.rows;
    },
    getLetterWithName: async function (name) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Letter" WHERE "name" ILIKE $1', [`%${name}%`]);
        return results.rows;
    },
    getRandomWinnableLetter: async function (drop) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Letter" WHERE "winnable" = true AND "sharable_percentage" >= $1 ORDER BY RANDOM() LIMIT 1', [drop]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    },
    getAppliedLetterFromUser: async function (id_user, id_guild) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "User_Letter" WHERE "applied" = true AND "id_user" = $1 AND "id_guild" = $2', [id_user, id_guild]);
        if (results.rows.length === 0) {
            // get the default letter
            const defaultLetter = await pool.query('SELECT * FROM "Letter" WHERE "name" = $1', ['Défaut']);
            if (defaultLetter.rows.length === 0) {
                return null;
            }
            return defaultLetter.rows[0];
        }
        return results.rows[0];
    },
    insertLetter: async function (name, url, winnable, sharable, sharable_percentage) {
        const pool = db.getPool();
        const result = await pool.query(
            'INSERT INTO "Letter" ("name", "url", "winnable", "sharable", "sharable_percentage") VALUES ($1, $2, $3, $4, $5) RETURNING "id_letter"',
            [name, url, winnable, sharable, sharable_percentage]
        );
        return result.rows[0].id_letter;
    }
}