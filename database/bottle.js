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
    insertBottle: async function (id_bottle, id_user_sender, id_user_receiver, id_channel, name, nb_sea) {
        const pool = getPool();
        return await pool.query('INSERT INTO "Bottle" ("id_bottle", "id_user_sender", "id_user_receiver", "id_channel", "name", "nb_sea") VALUES ($1, $2, $3, $4, $5, $6)', [id_bottle, id_user_sender, id_user_receiver, id_channel, name, nb_sea]);
    },
    getReceiver : async function (id_bottle) {
        const pool = getPool();
        const results = await pool.query('SELECT id_user_receiver FROM "Bottle" WHERE id_bottle = $1', [id_bottle]);
        if (results.rows.length > 0) {
            return results.rows[0].id_user_receiver;
        }
        return null;
    },
    switchSenderReceiver: async function (id_bottle) {
        const pool = getPool();
        return await pool.query('UPDATE "Bottle" SET "id_user_sender" = "id_user_receiver", "id_user_receiver" = "id_user_sender" WHERE "id_bottle" = $1', [id_bottle]);
    },
    deleteBottle: async function (id_bottle) {
        const pool = getPool();
        return await pool.query('DELETE FROM "Bottle" WHERE "id_bottle" = $1', [id_bottle]);
    },
    incr_sea: async function (id_bottle) {
        const pool = getPool();
        return await pool.query('UPDATE "Bottle" SET "nb_sea" = "nb_sea" + 1 WHERE "id_bottle" = $1', [id_bottle]);
    },
    get_sea: async function (id_bottle) {
        const pool = getPool();
        const results = await pool.query('SELECT nb_sea FROM "Bottle" WHERE id_bottle = $1', [id_bottle]);
        if (results.rows.length > 0) {
            return results.rows[0].nb_sea;
        }
        return null;
    },
    getOldestBottleNotArchived: async function () {
        const pool = getPool();
        const results = await pool.query('SELECT id_channel FROM "Message" WHERE "id_message" IN (SELECT MAX("id_message") FROM "Message" GROUP BY "id_bottle") ORDER BY "date" ASC LIMIT 1;');
        if (results.rows.length > 0) {
            return results.rows[0].id_channel;
        }
        return null;
    }
}