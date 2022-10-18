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
    getRandomState: async function () {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Etat" ORDER BY random() LIMIT 1');
        return results.rows[0]["etat"];
    },
    getRandomColor: async function () {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Couleur" ORDER BY random() LIMIT 1');
        return results.rows[0]["couleur"];
    },
    getRandomEmoji: async function () {
        const pool = getPool();
        const results = await pool.query('SELECT * FROM "Emoji" ORDER BY random() LIMIT 1');
        return results.rows[0]["emoji"];
    }
};