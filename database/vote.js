const { dbuser, dbhost, dbbase, dbpassword, dbport } = require('../db.json');

const Pool = require('pg').Pool
function getPool() {
    const pool = new Pool({
        user: dbuser,
        host: dbhost,
        database: dbbase,
        password: dbpassword,
        port: dbport
        // ssl: { rejectUnauthorized: false }
    })
    return pool;
}

module.exports = {
    insertVote: async function (id_message, id_user, vote) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Vote" ("id_message", "id_user", "vote") VALUES ($1, $2, $3)', [id_message, id_user, vote]);
    },
    getNumberOfUpVotesOfAMessage: async function (id_message) {
        const pool = getPool();
        const result = await pool.query('SELECT COUNT(*) FROM "Vote" WHERE "id_message" = $1 AND "vote" = true', [id_message]);
        return result.rows[0].count;
    },
    getNumberOfDownVotesOfAMessage: async function (id_message) {
        const pool = getPool();
        const result = await pool.query('SELECT COUNT(*) FROM "Vote" WHERE "id_message" = $1 AND "vote" = false', [id_message]);
        return result.rows[0].count;
    },
    getVote: async function (id_message, id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Vote" WHERE "id_message" = $1 AND "id_user" = $2', [id_message, id_user]);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows[0]["vote"];
    }
};