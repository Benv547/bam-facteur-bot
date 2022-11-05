var db = require('./pgpool.js');

module.exports = {
    getRandomState: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Etat" ORDER BY random() LIMIT 1');
        return results.rows[0]["etat"];
    },
    getRandomColor: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Couleur" ORDER BY random() LIMIT 1');
        return results.rows[0]["couleur"];
    },
    getRandomEmoji: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Emoji" ORDER BY random() LIMIT 1');
        return results.rows[0]["emoji"];
    }
};