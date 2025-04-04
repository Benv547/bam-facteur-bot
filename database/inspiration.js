var db = require('./pgpool.js');

module.exports = {
    getRandomInspiration: async function () {
        const pool = db.getPool();
        const res = await pool.query('SELECT text FROM "BottleStartExample" ORDER BY RANDOM() LIMIT 1');
        if (res.rows.length > 0) {
            return res.rows[0].text;
        }
    },
};