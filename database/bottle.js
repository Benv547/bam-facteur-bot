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
    insertBottle: async function (id_bottle, id_user_sender, id_user_receiver, id_channel, name) {
        const pool = getPool();
        await pool.query('INSERT INTO "Bottle" ("id_bottle", "id_user_sender", "id_user_receiver", "id_channel", "name") VALUES ($1, $2, $3, $4, $5)', [id_bottle, id_user_sender, id_user_receiver, id_channel, name], (error, results) => {
            if (error) {
                console.log(error)
            }
            return results;
        });
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
        await pool.query('UPDATE "Bottle" SET "id_user_sender" = "id_user_receiver", "id_user_receiver" = "id_user_sender" WHERE "id_bottle" = $1', [id_bottle], (error, results) => {
            if (error) {
                console.log(error)
            }
            return results;
        });
    }
}