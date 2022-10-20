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
    getAnniversaire: async function (monthDate, dayDate) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "User" WHERE "anniversaireJour" = $1 AND "anniversaireMois" = $2', [dayDate, monthDate]); 
        if (results.rows.length > 0) {
            return results.rows;
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
    },
    update_anniversaire: async function (id_user, jour, mois) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "anniversaireJour" = $1, "anniversaireMois" = $2 WHERE "id_user" = $3', [jour, mois, id_user]);
    },
    incr_nb_invite: async function (id_user) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "nb_invite" = "nb_invite" + 1 WHERE "id_user" = $1', [id_user]);
    },
    get_nb_invite: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT "nb_invite" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].nb_invite;
        }
        return null;
    },
    incr_money: async function (id_user, qte) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "money" = "money" + $1 WHERE "id_user" = $2', [qte, id_user]);
    },
    reduce_money: async function (id_user, qte) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "money" = "money" - $1 WHERE "id_user" = $2', [qte, id_user]);
    },
    get_money: async function (id_user) {
        const pool = getPool();
        const results = await pool.query('SELECT "money" FROM "User" WHERE id_user = $1', [id_user]);
        if (results.rows.length > 0) {
            return results.rows[0].money;
        }
        return null;
    },
    incr_xp: async function (id_user, qte) {
        const pool = getPool();
        return await pool.query('UPDATE "User" SET "xp" = "xp" + $1 WHERE "id_user" = $2', [qte, id_user]);
    }
}