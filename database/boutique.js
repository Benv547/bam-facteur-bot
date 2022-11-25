var db = require('./pgpool.js');

module.exports = {
    getProductByTypeOnBoutique: async function (type) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Product" WHERE type = $1 AND boutique = true ORDER BY type ASC', [type]);
        if (results.rows.length > 0) {
            return results.rows;
        }
        return null;
    },
    getProductOnBoutique: async function () {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Product" WHERE boutique = true ORDER BY type ASC');
        if (results.rows.length > 0) {
            return results.rows;
        }
        return null;
    },
    getProductByIdItem: async function (id_item, type) {
        const pool = db.getPool();
        const results = await pool.query('SELECT * FROM "Product" WHERE id_item = $1 AND type = $2', [id_item, type]);
        if (results.rows.length > 0) {
            return results.rows[0];
        }
        return null;
    }
};