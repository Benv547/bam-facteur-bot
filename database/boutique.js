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
    },
    removeAllItemsOnBoutique: async function () {
        const pool = db.getPool();
        await pool.query('UPDATE "Product" SET boutique = false WHERE boutique = true');
    },
    set3RandomStickersWinnableInTheBoutique: async function () {
        const pool = db.getPool();
        // inner join with sticker to check if the sticker is winnable
        await pool.query('UPDATE "Product" SET boutique = true WHERE id_item IN (SELECT id_sticker FROM "Product" INNER JOIN "Sticker" ON "Product".id_item = "Sticker".id_sticker WHERE "Sticker".winnable = true AND "Product".type = \'sticker\' ORDER BY random() LIMIT 3)');
    },
    set3RandomArabesquesWinnableInTheBoutique: async function () {
        const pool = db.getPool();
        // inner join with sticker to check if the sticker is winnable
        await pool.query('UPDATE "Product" SET boutique = true WHERE id_item IN (SELECT id_footer FROM "Product" INNER JOIN "Footer" ON "Product".id_item = "Footer".id_footer WHERE "Footer".winnable = true AND "Product".type = \'arabesque\' ORDER BY random() LIMIT 3)');
    },
};