const { dbuser, dbhost, dbbase, dbpassword, dbport } = require('../config.json');

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
    createUser: async function (id_user, money, xp) {
        const pool = getPool();
        return await pool.query('INSERT INTO "User" ("id_user", "money", "xp") VALUES ($1, $2, $3)', [id_user, money, xp]);
    },
    getUser: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    deleteUser: async function (id_user) {
        const pool = getPool();
        return await pool.query('DELETE FROM "User" WHERE "id_user" = $1', [id_user]);
    },
    incr_nb_warn: async function (id_user) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "nb_warn" = "nb_warn" + 1 WHERE "id_user" = $1', [id_user]);
    },
    update_diceBearSeed: async function (id_user, diceBearSeed) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "diceBearSeed" = $1 WHERE "id_user" = $2', [diceBearSeed, id_user]);
    }
}