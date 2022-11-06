var db = require('./pgpool.js');

module.exports = {
    getProfile: async function (id_profile) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Profile_ile" WHERE id_profile = $1', [id_profile]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    },
    getRandomProfileId: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT id_profile FROM "Profile_ile" ORDER BY RANDOM() LIMIT 1');
        if (results.rows.length > 0) {
            return results.rows[0].id_profile;
        }
        return null;
    }
};