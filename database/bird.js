var db = require('./pgpool.js');

module.exports = {
    insertBird: async function (id_channel, id_guild, id_user, name, content) {
        const pool = await db.getPool();
        return await pool.query('INSERT INTO "Bird" (id_channel, id_guild, id_user, name, content) VALUES ($1, $2, $3, $4, $5)', [id_channel, id_guild, id_user, name, content]);
    },
    incr_sea: async function (id_bird) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bird" SET "sea" = "sea" + 1 WHERE "id_bird" = $1', [id_bird]);
    },
    getDateOfLastBirdForUser: async function (id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT "date" FROM "Bird" WHERE "id_user" = $1 ORDER BY "date" DESC LIMIT 1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0]["date"];
        }
        return null;
    },
    getBird: async function (id_channel) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bird" WHERE id_channel = $1', [id_channel]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    update_id_channel: async function (id_bird, id_channel) {
        const pool = db.getPool();
        return await pool.query('UPDATE "Bird" SET "id_channel" = $1, "date" = NOW(), "sea" = "sea" + 1 WHERE "id_bird" = $2', [id_channel, id_bird]);
    },
    deleteBird: async function (id_channel) {
        const pool = db.getPool();
        return await pool.query('DELETE FROM "Bird" WHERE "id_channel" = $1', [id_channel]);
    },
    insertBirdReaction: async function (id_bird, id_user, id_emoji) {
        const pool = await db.getPool();
        return await pool.query('INSERT INTO "BirdReaction" (id_bird, id_user, id_emoji) VALUES ($1, $2, $3)', [id_bird, id_user, id_emoji]);
    },
    getReactionByUser: async function (id_bird, id_user) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "BirdReaction" WHERE id_bird = $1 AND id_user = $2', [id_bird, id_user]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getAllBirdAfterOneHour: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Bird" WHERE "date" < NOW() - INTERVAL \'1 hour\'');
        if (results.rows.length > 0) {
            return results.rows;
        }
        return null;
    },
    getReactions: async function (id_bird) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "BirdReaction" WHERE id_bird = $1', [id_bird]);
        if (results.rows.length > 0) {
            return results.rows;
        }
        return null;
    }
};