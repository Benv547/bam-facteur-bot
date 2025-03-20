var db = require('./pgpool.js');

module.exports = {
    insertProduct: async function (id_item, price, type) {
        const pool = db.getPool();
        return await pool.query('INSERT INTO "Product" ("id_item", "price", "type") VALUES ($1, $2, $3)', [id_item, price, type]);
    }
}