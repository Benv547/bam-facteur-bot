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
    insertInvite: async function (id_user_inviter, id_user_invited) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Invite" ("id_user_inviter", "id_user_invited") VALUES ($1, $2)', [id_user_inviter, id_user_invited]);
    },
    getNumberOfInvite: async function (id_user_inviter) {
        const pool = getPool();
        const results = await pool.query('SELECT COUNT(*) FROM "Invite" WHERE "id_user_inviter" = $1', [id_user_inviter]);
        if (results.rows.length > 0) {
            return results.rows[0]["count"];
        }
        return 0;
    },
    getListOfUserInvited: async function (id_user_inviter) {
        const pool = getPool();
        const results = await pool.query('SELECT "id_user_invited" FROM "Invite" WHERE "id_user_inviter" = $1', [id_user_inviter]);
        if (results.rows.length > 0) {
            return results.rows;
        }
        return null;
    }
};