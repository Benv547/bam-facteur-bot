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
    insertMessage: async function (id_message, id_bottle, id_channel, id_user, content) {
        const pool = getPool();
        await pool.query('INSERT INTO "Message" ("id_message", "id_bottle", "id_channel", "id_user", "content") VALUES ($1, $2, $3, $4, $5)', [id_message, id_bottle, id_channel, id_user, content], (error, results) => {
            if (error) {
                console.log(error)
                return results;
            }
        })
    },
    getMessage: async function (id_message) {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Message" WHERE id_message = $1', [id_message], (error, results) => {
            if (error) {
                console.log(error)
                return results;
            }
        })
        return results;
    }
};